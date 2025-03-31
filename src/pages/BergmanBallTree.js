// File: BergmanBallTree.js
// (This file remains unchanged and contains our basic Ball Tree implementation for a single nearest neighbor search.)

export class BergmanBallTree {
    constructor(points, distanceFunc) {
      this.distance = distanceFunc;
      this.root = this.buildTree(points);
    }
  
    buildTree(points) {
      if (points.length === 0) return null;
      if (points.length === 1) {
        return {
          point: points[0],
          left: null,
          right: null,
          radius: 0,
          center: points[0],
        };
      }
      // Sort points by 'score' (you can choose a different or composite criterion)
      const sorted = points.slice().sort((a, b) => a.score - b.score);
      const medianIndex = Math.floor(sorted.length / 2);
      const center = sorted[medianIndex];
      let radius = 0;
      for (let p of sorted) {
        const d = this.distance(p, center);
        if (d > radius) radius = d;
      }
      const leftPoints = sorted.slice(0, medianIndex);
      const rightPoints = sorted.slice(medianIndex + 1);
      return {
        point: center,
        left: this.buildTree(leftPoints),
        right: this.buildTree(rightPoints),
        radius: radius,
        center: center,
      };
    }
  
    // A simple nearest neighbor search.
    nearest(queryPoint, best = { point: null, dist: Infinity }, node = this.root) {
      if (node === null) return best;
      const d = this.distance(queryPoint, node.point);
      if (d < best.dist) {
        best = { point: node.point, dist: d };
      }
      const left = node.left;
      const right = node.right;
      if (left && right) {
        if (queryPoint.score < node.point.score) {
          best = this.nearest(queryPoint, best, left);
          if (Math.abs(queryPoint.score - node.point.score) < best.dist) {
            best = this.nearest(queryPoint, best, right);
          }
        } else {
          best = this.nearest(queryPoint, best, right);
          if (Math.abs(queryPoint.score - node.point.score) < best.dist) {
            best = this.nearest(queryPoint, best, left);
          }
        }
      } else if (left) {
        best = this.nearest(queryPoint, best, left);
      } else if (right) {
        best = this.nearest(queryPoint, best, right);
      }
      return best;
    }
  }
  