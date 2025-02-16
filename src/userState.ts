import { createMutable } from "solid-js/store";

export const userState = createMutable({
    hasHovered: false
})



export const levelInfo = createMutable<{locked: boolean, number: number, difficulty: string, completed_in: number, "contains square root"?: boolean, stars?: number}[]>([
    {locked: false, number: 1, difficulty: "Easy", completed_in: 3 },
    {locked: true, number: 2, difficulty: "Easy", completed_in: 3},
    {locked: true, number: 3, difficulty: "Easy", completed_in: 3},
    {locked: true, number: 4, difficulty: "Easy", completed_in: 3},
    {locked: true, number: 5, difficulty: "Super Easy", completed_in: 0},
    {locked: true, number: 6, difficulty: "Medium", completed_in: 0},
    {locked: true, number: 7, difficulty: "Hard", completed_in: 0, "contains square root": true}, 
    {locked: true, number: 8, difficulty: "Hard", completed_in: 0}, 
    {locked: true, number: 9, difficulty: "Hard", completed_in: 0, "contains square root": true}, 
    {locked: true, number: 10, difficulty: "Hard", completed_in: 0}, 
    {locked: true, number: 12, difficulty: "Hard", completed_in: 0}, 
    {locked: true, number: 13, difficulty: "Hard", completed_in: 0}, 

])