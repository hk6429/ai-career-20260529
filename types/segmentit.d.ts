declare module "segmentit" {
  export class Segment {
    doSegment(text: string): { w: string; p?: number }[];
  }
  export function useDefault(seg: Segment): Segment;
}
