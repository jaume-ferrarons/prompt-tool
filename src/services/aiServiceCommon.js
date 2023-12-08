function buildAnswer(status, raw) {
    const errorMessage = status !== 200 ? raw["message"] || raw["error"] : null
    const answer = status === 200 ? raw["text"] : null
    return {
        "status": status,
        "raw": raw,
        errorMessage,
        answer
    }
}

export { buildAnswer };