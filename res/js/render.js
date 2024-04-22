import { SystemFn, $ } from "./utilities.js";

const elementsRender = function() {
    //Ripple animate button
    $(".btn-ripple").each(btn => {
        $(btn).on("click", function() {
            btn.rippleAnimation();
        });
    });
};
SystemFn(elementsRender);
setInterval(elementsRender, 1000); // Auto rendering and mapping