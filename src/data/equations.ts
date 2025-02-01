import { Side } from "../App";

export const equations: { rhs: Side; lhs: Side; }[] = [
  
  {
    lhs: {
      variable: {value: 4,
      letter: "y",
      product: 3},
      coefficient: 3,
      side: "left"
    },
    rhs: {
      variable: null,
      coefficient: 18,
      side: "right"
    }
  },
  {
    lhs: {
      variable: {value: 2,
      letter: "x",
      product: 4,},
      coefficient: 1,
      side: "left"
    },
    rhs: {
      variable: {value: 2,
      letter: "x",
      product: 2,},
      coefficient: 9,
      side: "right"
    }
  },
  {
    lhs: {
      variable: {value: 7,
      letter: "x",
      product: 4,},
      coefficient: -10,
      side: "left"
    },
    rhs: {
      variable: null,
      coefficient: 18,
      side: "right"
    }
  },
  {
    lhs: {
      variable: {value: -3,
      letter: "a",
      product: 10,},
      coefficient: 9,
      side: "left"
    },
    rhs: {
      variable: null,
      coefficient: -21,
      side: "right"
    }
  },
  {
    lhs: {
      variable: {value: -4,
      letter: "a",
      product: -3,},
      coefficient: 2,
      side: "left"
    },
    rhs: {
      variable: null,
      coefficient: 14,
      side: "right"
    }
  },
];
