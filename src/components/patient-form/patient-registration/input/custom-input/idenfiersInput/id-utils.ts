export function formatNif(Number) {
    return Number.replace(/\D/g, "").match(/.{1,3}/g)?.join("-").substr(0, 13) || ""

}

export function formatCin(Number) {
    return Number.replace(/\D/g, "").match(/.{1,3}/g)?.join("").substr(0, 10) || ""

}