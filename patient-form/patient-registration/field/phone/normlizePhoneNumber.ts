import { useEffect, useRef, useState } from "react";


export default function formatPhoneNumber(phoneNumberString) {
    return phoneNumberString.replace(/\D/g, "").match(/.{1,4}/g)?.join("-").substr(0, 9) || ""

}

