import { jsx as _jsx } from "react/jsx-runtime";
import { addPropertyControls, ControlType } from "framer";
import { motion } from "framer-motion";
import { useFriendData } from "https://framer.com/m/useFriendData-KsqW.js@49LqGhG5WVpNVYsbcpCU";
/**
 *
 * [1] Open the Import Menu from the toolbar
 *
 * [2] Search for "Friend" and select the result under "Project Components"
 *
 * [3] Once selected, click the "Import" button in the menu
 *
 * [4] You now see a new "Friend" import on line 3
 *
 * [5] Remove the <div /> on lines 31-35 and replace it with the code below
 *     <Friend {...friend} />
 *
 * [6] Return to the canvas, you should see a list of friends!
 *
 * [*] Bonus: Change the "count" control on the canvas to see the list auto-size
 *
 */ export default function Friends({ count  }) {
    const friends = useFriendData(count);
    return(/*#__PURE__*/ _jsx(motion.div, {
        style: listStyle,
        children: friends.map((friend)=>/*#__PURE__*/ _jsx("div", {
                // Replace me with a Smart Component
                style: placeholderStyle
            })
        )
    }));
};
Friends.defaultProps = {
    count: 5
};
addPropertyControls(Friends, {
    count: {
        title: "Count",
        type: ControlType.Number,
        displayStepper: true,
        min: 1,
        max: 30
    }
});
const listStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
};
const placeholderStyle = {
    backgroundColor: "rgba(255,255,255,0.05)",
    margin: "10px auto",
    borderRadius: 20,
    width: 340,
    height: 100
};

export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"Friends","slots":[],"annotations":{"framerContractVersion":"1"}}}}
//# sourceMappingURL=./Friends.map