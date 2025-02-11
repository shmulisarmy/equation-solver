import { userState } from "../userState";
import { getDeviceType } from "../utils/Device";
import styles from "./.module.css";

export function UndoArrow(){
    return(
      <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
       width="20px" height="20px" viewBox="0 0 454.839 454.839"
       xml:space="preserve">
  <g>
      <path d="M404.908,283.853c0,94.282-76.71,170.986-170.986,170.986h-60.526c-10.03,0-18.158-8.127-18.158-18.157v-6.053
          c0-10.031,8.127-18.158,18.158-18.158h60.526c70.917,0,128.618-57.701,128.618-128.618c0-70.917-57.701-128.618-128.618-128.618
          H122.255l76.905,76.905c8.26,8.257,8.26,21.699,0,29.956c-8.015,8.009-21.964,7.997-29.961,0L56.137,149.031
          c-4.001-4.001-6.206-9.321-6.206-14.981c0-5.656,2.205-10.979,6.206-14.978L169.205,6.002c7.997-8.003,21.958-8.003,29.956,0
          c8.26,8.255,8.26,21.699,0,29.953l-76.905,76.911h111.666C328.198,112.866,404.908,189.573,404.908,283.853z"/>
  </g>
  </svg>
    )
  }
export function ArrowBoxSVG({message}: {message?: string}) {
  const away_from_left: number = 50
  

  return (



    <svg  id={styles.arrow_box} width="360" height="240" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0,0 6,3 0,6" fill="white" />
        </marker>
      </defs>

      <rect class={styles["text-box"]} x={`${away_from_left}%`} y="20%" width="70%" height="35%" stroke="black" fill="lightgray" stroke-width="2" />

        <text  
          x={`${away_from_left+5}%` }
          y={`${35}%`}
          style={{"font-family": "Arial",
          fill: "black"
        }}
        font-size="12"
        >{message}</text>
      

      <line x1={`${away_from_left+30}%`} y1="55%" x2="110%" y2="100%" stroke="lightgray" stroke-width="2" marker-end="url(#arrowhead)" />
    </svg>

  )
}
