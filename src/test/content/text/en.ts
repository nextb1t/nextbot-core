import { BotText } from "../../../index"

const botText: BotText = {

  greeting: { text: "Behold, earthlings" },

  buttonas: { text: "I command you to press a button:",
              tbuttons: [ { title: "button-1", callback: "B1" },
                          { title: "button-2", callback: "B2" } ] },

  result1: { text: "Good button :-)" },

  result2: { text: "Bag button >:-|" }

}

export default botText