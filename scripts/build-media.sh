#!/bin/zsh
# Rebuilds every image and clip the case studies use from the source media.
#
# Neither the source nor the output is in this repo. The source lives in
# ~/Desktop/Portfolio, one folder per project, and runs to about 2.2 GB, nearly
# all of it the one HRX recording. The output goes to $OUT/case (default
# $SRC/web/case); upload what changed to Media in /admin and pick it in the
# project.
#
# Every frame arrives as a finished mockup, device, scene and screen recording
# already cut together: 1920x1440 MP4s in $SRC/3DConf and
# $SRC/{Modesto,HRX,SizeFlow}/mockups, plus one still render for Size Flow. The
# one exception is a single HRX still cropped out of a raw screen recording.
#
# Requires: ffmpeg (libx264), cwebp, python3.
# Usage:    ./scripts/build-media.sh
#
# Three ways a file reaches the page
#   finished — a mockup video that arrived cut. The only decision left is how
#             much of the scene the tile keeps, then the shipping encode.
#   render  — the same for a still mockup.
#   detail  — a sub-crop of the 3D viewport in a raw recording, with no
#             interface in it at all, shown full bleed as a product shot.
#
# The raw recording is a 2946x1932 screen capture with the app window
# letterboxed inside it. `ffmpeg -vf cropdetect` puts that window at
# 2722x1708+112+76, which is what `detail` crops within.
set -e

SRC=${SRC:-$HOME/Desktop/Portfolio}
OUT=${OUT:-$SRC/web}
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
mkdir -p $OUT/case

FULL="crop=2722:1708:112:76" # the app window inside a raw recording

# NOTE: brace every variable inside a filter string. zsh applies history
# modifiers to `$h:f...` and `$8:s...`, which silently corrupts filter graphs.

webp() { cwebp -quiet -q "${3:-82}" -m 6 "$1" -o "$2"; }

# The shipping clip plus a poster. The poster is the clip's own first frame, so
# it is what the reader sees before the video has downloaded a byte.
#
# One encode, H.264, because every browser plays it. A VP9 WebM beside it came
# out about a third smaller, but it doubled the files for the same frames.
#
# -g 240 rather than a couple of seconds' worth. Nothing on the page can seek
# these: they autoplay on scroll, loop, and pause again, so keyframes buy no
# granularity anyone can use and every one of them re-sends the whole scene.
# Against a photographic device that costs real bytes and buys about 1dB: on a
# phone clip, -g 240 came out 4.5x smaller at 43dB.
ship_clip() { # raw.mp4 outbase
  ffmpeg -nostdin -v error -i "$1" -an -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -crf 27 -preset slow -g 240 -movflags +faststart "${2}.mp4" -y
  ffmpeg -nostdin -v error -i "$1" -frames:v 1 "$TMP/p.png" -y
  webp "$TMP/p.png" "${2}.webp" 82
}

# ---------------------------------------------------------------- render path
# A mockup that arrived finished, device and screen content rendered together,
# so there is no panel to black out, no quad to warp and no capture to fit: the
# whole decision is how much of the scene a tile keeps. `window` takes the
# largest rectangle of the wanted ratio that fits inside the source and slides
# it with xoff/yoff.
#
# What it crops is scene, never interface. Each window below clears its device
# with room to spare, so the UI sits inside a device and nothing slices it. The
# margins are why the ratios are what they are.
window() { # src cropRatio outW xoff yoff    prints the crop-and-scale filter
  local crop=$2 ow=$3 xoff=$4 yoff=$5
  local WH=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height \
    -of csv=p=0:s=x "$1")
  local SW=${WH%x*} SH=${WH#*x}
  # Rounded before the even floor, so a ratio written to four places (1.3333)
  # still takes an exact 4:3 source whole instead of shaving a row off it.
  local CW=$(python3 -c "w=min($SW,round($SH*$crop));print(w-w%2)")
  local CH=$(python3 -c "h=min($SH,round($CW/$crop));print(h-h%2)")
  local CX=$(python3 -c "print(int(($SW-$CW)*$xoff))") CY=$(python3 -c "print(int(($SH-$CH)*$yoff))")
  local OH=$(python3 -c "h=round($ow/$crop);print(h-h%2)")
  print -r -- "crop=${CW}:${CH}:${CX}:${CY},scale=${ow}:${OH}:flags=lanczos"
}

render() { # src out.webp cropRatio outW [xoff] [yoff]
  local src=$SRC/$1 out=$2
  ffmpeg -nostdin -v error -i "$src" -frames:v 1 \
    -vf "$(window $src $3 $4 ${5:-0.5} ${6:-0.5})" "$TMP/r.png" -y
  webp "$TMP/r.png" "$out" 84
  echo "  render        -> ${out:t}"
}

# -------------------------------------------------------------- finished path
# `render` for video. The clip arrives cut and paced, so it keeps its own speed
# and frame rate; the window and the shipping encode are all that happen to it.
finished_clip() { # src outbase cropRatio outW [xoff] [yoff]
  local src=$SRC/$1
  ffmpeg -nostdin -v error -i "$src" -vf "$(window $src $3 $4 ${5:-0.5} ${6:-0.5})" \
    -an -c:v libx264 -crf 12 -preset veryfast "$TMP/raw.mp4" -y
  ship_clip "$TMP/raw.mp4" "$2"
  echo "  finished clip -> ${2:t}"
}

# ----------------------------------------------------------------- detail path
detail() { # src time crop2 outw out.webp
  ffmpeg -nostdin -v error -ss "$2" -i "${SRC}/$1" -frames:v 1 \
    -vf "${FULL},crop=$3,scale=$4:-2:flags=lanczos" "$TMP/f.png" -y
  webp "$TMP/f.png" "$5"; echo "  detail        -> ${5:t}"
}

C=$OUT/case

# Nine finished clips, one per feature, in the order the case study tells it:
# the workspace, the editor's tools in the order a scene gets built, publishing,
# then the published viewer on a laptop and on a phone.
#
# The laptops keep the full 4:3 frame they were cut at, so nothing is cropped
# at all. The two phone clips go portrait instead: a phone is a quarter of a
# 4:3 frame, and at tile size its screen would be a smudge. The 3:4 window
# keeps the whole phone at every frame of both clips and only trims the hands.
#
# The landing clip is also the work-grid tile's hover loop, and its first frame
# is the cover, so grid and case study share one download.
#
# Names are the feature, and every one is new. The two cuts before this spent
# cover, hero, editor, mobile, editor-* and viewer-*, and re-using a path for
# different bytes leaves the old image sitting in browser caches and in
# .next/cache/images, which is what happened the first time round. A new name
# is the only reliable bust.
echo "3d-configurator (finished clips)"
mkdir -p $C/3d-configurator
M="3DConf"; D=$C/3d-configurator
finished_clip "$M/3d_configurator_Landing.mp4"                    $D/landing          1.3333 960
finished_clip "$M/3d_configurator_Material_Editor-web.mp4"        $D/material-editor  1.3333 960
finished_clip "$M/3d_configurator_Variant_Manager-web.mp4"        $D/variant-manager  1.3333 960
finished_clip "$M/3d_configurator_Decals-web.mp4"                 $D/decals           1.3333 960
finished_clip "$M/3d_configurator_Post_Processing-web.mp4"        $D/post-processing  1.3333 960
finished_clip "$M/3d_configurator_Publish-web.mp4"                $D/publish          1.3333 960
finished_clip "$M/3d_configurator_Viewer-web.mp4"                 $D/viewer-overview  1.3333 960
finished_clip "$M/3d_configurator_Mobile_Viewer_Editor-web.mp4"   $D/mobile-2d-editor 0.75   720
finished_clip "$M/3d_configurator_Mobile_Viewer_Variants-web.mp4" $D/mobile-variants  0.75   720

# Six finished clips plus one still kept from the first cut: the sponsor close-up
# with the five chest zones outlined, still cropped out of the old recording.
# The lead keeps its full 4:3, which the work grid's right column is sized
# around; the tablet goes 3:4 like the phones elsewhere, centred on the tablet.
# The lead clip is also the grid tile's hover loop. New names throughout: the
# first cut spent cover, hero, dashboard, suit, suitfull and hrx-loop.
echo "hrx (finished clips + the sponsor still)"
mkdir -p $C/hrx
M="HRX/mockups"; D=$C/hrx
finished_clip "$M/HRX_Cover-web.mp4"          $D/overview     1.3333 960
finished_clip "$M/HRX_Loading-web.mp4"        $D/loading      1.3333 960
finished_clip "$M/HRX_Editor_2d-web.mp4"      $D/editor-chest 1.3333 960
detail "HRX/hrx-desktop.mov" 522 "1500:1500:1030:0" 1200 $D/sponsor.webp
finished_clip "$M/HRX_Editor_2d_back-web.mp4" $D/editor-back  1.3333 960
finished_clip "$M/HRX_Shoes-web.mp4"          $D/shoes        1.3333 960
finished_clip "$M/HRX_Tablet-web.mp4"         $D/tablet       0.75   720 0.465

# Seven finished clips, the same treatment as 3d-configurator's. The lead clip
# is cropped square: the work grid needs this tile square to keep its left
# column the taller one (see the Projects list in /admin). The window sits right of
# centre because the laptop does, and it only drops sofa. The phones go 3:4
# like the configurator's, whole phone kept at every frame.
#
# The lead clip is also the grid tile's hover loop, and its first frame is the
# cover. Names are all new: the cut before this spent cover, hero, macro,
# mobile, fabric and button, and a reused path serves stale bytes from caches.
echo "modesto-bertotto (finished clips)"
mkdir -p $C/modesto-bertotto
M="Modesto/mockups"; D=$C/modesto-bertotto
finished_clip "$M/modesto_Cover-web.mp4"                      $D/overview            1.0    960 0.69
finished_clip "$M/modesto_Wizzard-web.mp4"                    $D/wizard              1.3333 960
finished_clip "$M/modesto_Fabric_gilet_super_zoom-web.mp4"    $D/fabric-zoom         1.3333 960
finished_clip "$M/modesto_Rendering_summary_download-web.mp4" $D/summary             1.3333 960
finished_clip "$M/modesto_Shoes_customization-web.mp4"        $D/shoes               1.3333 960
finished_clip "$M/modesto_Mobile_1-web.mp4"                   $D/mobile-configurator 0.75   720 0.52
finished_clip "$M/modesto_Mobile_2-web.mp4"                   $D/mobile-summary      0.75   720

# Seven finished clips across the Sportful, Karpos and Castelli stores, plus the
# supplied render of the widget over a Sportful product page. The user-data
# clip leads: it is the cover and the grid tile's hover loop, and 4:3 like the
# tile, which the work grid is balanced around.
# Laptops and the tablet keep their full 4:3; the phones go 3:4, whole phone kept
# at every frame. Every clip name is new: the cut before this spent hero, chip,
# mobile, phone, measures and castelli.
echo "size-flow (Sportful render + finished clips)"
mkdir -p $C/size-flow
M="SizeFlow/mockups"; D=$C/size-flow
render "SizeFlow/size-flow-cover.png" $D/storefront.webp 1.25 1600 1.00
finished_clip "$M/size-flow_Cover_Sportful_-_user_data-web.mp4"         $D/user-data              1.3333 960
finished_clip "$M/size-flow_Karpos_desktop_-_refine_body_shape-web.mp4" $D/body-shape             1.3333 960
finished_clip "$M/size-flow_Sportful_Desktop_-_size_suggestion-web.mp4" $D/size-suggestion        1.3333 960
finished_clip "$M/size-flow_Castelli_tablet_-_fill_user_data-web.mp4"   $D/tablet                 1.3333 960
finished_clip "$M/size-flow_Mobile_2_-_user_data-web.mp4"               $D/mobile-user-data       0.75   720
finished_clip "$M/size-flow_Mobile_1_-_refine_body_shape-web.mp4"       $D/mobile-body-shape      0.75   720
finished_clip "$M/size-flow_Mobile_3_-_size_suggestion-web.mp4"         $D/mobile-size-suggestion 0.75   720

echo "done"
