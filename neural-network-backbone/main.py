import argparse
from dataclasses import dataclass

from bytetracker import BYTETracker
from roboflow import Roboflow
from supervision import BoxAnnotator
from supervision.draw.color import ColorPalette
from supervision.video import VideoInfo, VideoSink
from supervision.video import get_video_frames_generator

from tracking.colors import convert_to_hex_color
from tracking.utils import *


@dataclass(frozen=True)
class BYTETrackerArgs:
    track_thresh: float = 0.25
    track_buffer: int = 30
    match_thresh: float = 0.8
    aspect_ratio_thresh: float = 3.0
    min_box_area: float = 1.0
    mot20: bool = False


def main(args):
    SOURCE_VIDEO_PATH = args.input

    rf = Roboflow(api_key="bdAvwORYXz3sYBNRPlIG")
    project = rf.workspace().project("full-dataset-4ekr5")
    model = project.version(4).model
    classes = project.classes

    project_colors = list(map(convert_to_hex_color, project.colors.values()))

    CLASS_NAMES = list(classes.keys())

    # create BYTETracker instance
    byte_tracker = BYTETracker(track_thresh=0.3, track_buffer=30)
    # create VideoInfo instance
    video_info = VideoInfo.from_video_path(SOURCE_VIDEO_PATH)
    # create frame generator
    generator = get_video_frames_generator(SOURCE_VIDEO_PATH)
    # create instance of BoxAnnotator and LineCounterAnnotator
    box_annotator = BoxAnnotator(color=ColorPalette(project_colors), thickness=2, text_thickness=2, text_scale=0.6)

    CLASS_ID = list(map(lambda x: CLASS_NAMES.index(x), args.filter))

    DEST_VIDEO_PATH = args.output

    # open target video file
    with VideoSink(DEST_VIDEO_PATH, video_info) as sink:
        count = 0
        # loop over video frames
        for frame in generator:
            count += 1
            print(f'{count}/{video_info.total_frames}')
            # model prediction on single frame and conversion to supervision Detections
            results = dict(model.predict(frame).json())
            detections = Detections.from_roboflow(results, CLASS_NAMES)

            # filtering out detections with unwanted classes
            mask = np.array([class_id in CLASS_ID for class_id in detections.class_id], dtype=bool)
            filter_detections(detections, mask, inplace=True)

            # tracking detections
            tracks = byte_tracker.update(detections2boxes(detections), None)
            tracker_id = match_detections_with_tracks(detections=detections, tracks=tracks)
            detections.tracker_id = np.array(tracker_id)

            # filtering out detections without trackers
            mask = np.array([tracker_id is not None for tracker_id in detections.tracker_id], dtype=bool)
            filter_detections(detections, mask, inplace=True)

            # format custom labels
            labels = [
                f"#{tracker_id} {CLASS_NAMES[class_id]} {confidence:0.2f}"
                for _, confidence, class_id, tracker_id
                in detections
            ]

            # annotate and display frame
            frame = box_annotator.annotate(scene=frame, detections=detections, labels=labels)
            sink.write_frame(frame)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='detect objects on video')
    parser.add_argument('--input', required=True, dest='input', type=str, help='Video to recognize')
    parser.add_argument('--output', required=True, dest='output', type=str, help='Path to write output video')
    parser.add_argument('--filter-classes', nargs='*', dest='filter', help='Classes to filter out from output')

    args = parser.parse_args()

    main(args)
