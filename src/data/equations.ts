import { Side } from "../App";






export const equations: { rhs: Side; lhs: Side; difficulty: "super easy" | "easy" | "medium" | "hard" }[] = [


  {
    difficulty: "super easy",
    diolog: ["assuming that the math statement 'x + 1 = 5' is correct, then find the value of x, for example we know x is not equal to 2 because 2 + 1 is not equal to 5 and would there for make this statement not true", "in order to help figure out the value of x we will try to get x to be by itself (on the left side) by getting rid of the +1 so that way the equation will read as 'x = ...'", "as you can see under the +1 is a pink line wich when you hover over it will help you get rid of the +1 to get the desired 'x = ..."],
    lhs: {
      variable: {value: 4,
        letter: "x",
        product: 1},
        coefficient: 1,
        side: "left"
      },
      rhs: {
        variable: null,
        coefficient: 5,
        side: "right"
      }
    },
    
    {
    diolog: ["for this equation we will first get rid of the +3 using the same tactic from before, once you do that the equation will read as '3x = ...' wich you can then devide 3x by 3 to get 'x = ...'"],
    difficulty: "easy",
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
    difficulty: "medium",
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
    diolog: ["this is starting to get harder because now there is an x of either side, however we can apply the same tactic we used before to get rid of the regular numbers and this time use it to get rid of the 2x on the right side"],
    difficulty: "medium",
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
    difficulty: "medium",
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
    difficulty: "medium",
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
 
  {
    difficulty: "hard",
    lhs: {
      
      variable: {value: 4,
      letter: "y",
      product: 5},
      coefficient: 5,
      side: "left"
    },
    rhs: {
      variable: null,
      coefficient: 2,
      side: "right",
      subExpression: {
        product: 2,
        variable: {value: 4,
          letter: "y",
          product: 1},
          coefficient: 3,
          subExpression: {
            product: 2,
            variable: {value: 4,
              letter: "y",
              product: 1},
              coefficient: 3,
              // side: "left"
            },
          // side: "left"
        },
    }
  },

];
