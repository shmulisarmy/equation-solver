import styles from "../App.module.css"

window.addEventListener("keydown", (e) => {
  console.log(e.key)
  let button_to_press
  if (e.ctrlKey) {
    button_to_press = document.querySelector(`[control-action="${e.key}"]`)
  } else {
   button_to_press = document.querySelector(`[plain-action="${e.key}"]`)
  }
  if(button_to_press){
    console.log(button_to_press)
     button_to_press.classList.add(styles["animate-press"])
    button_to_press.click()
    setTimeout(() => {
      button_to_press.classList.remove(styles["animate-press"])
    }, 1000)
  }
})
