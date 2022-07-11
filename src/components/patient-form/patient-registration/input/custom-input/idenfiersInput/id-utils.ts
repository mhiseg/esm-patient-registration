export function formatNif(number) {
    return number?.replace(/\D/g, "").match(/.{1,3}/g)?.join("-").substr(0, 13) || ""

}

export function formatCin(number) {
    return number?.replace(/\D/g, "").match(/.{1,3}/g)?.join("").substr(0, 10) || ""

}