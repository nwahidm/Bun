import * as jose from "jose"

export const getToken = async (payload: jose.JWTPayload, expired?: string) => {
    const signJWT = new jose.SignJWT(payload).setProtectedHeader({ alg: "HS256" })

    if (expired) {
        signJWT.setExpirationTime(expired)
    }

    return await signJWT.sign(new TextEncoder().encode(Bun.env.secret))
}