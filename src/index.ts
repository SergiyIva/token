export class AuthToken {
  secret: string;

  constructor(secret: string) {
    if ((secret.match(new RegExp("\\|", "g")) || []).length !== 1) {
      throw new Error("Invalid secret");
    }
    this.secret = secret;
  }

  async makeToken(payload: Record<any, any>): Promise<string> {
    const payloadString = JSON.stringify(payload);
    const sign = await this._encode(payloadString);

    return Buffer.from(`${payloadString}|${sign}`).toString("base64");
  }

  async decodeAndCheck(token: string): Promise<Record<string, any> | null> {
    try {
      const [objString, sign] = Buffer.from(token, "base64")
        .toString("utf-8")
        .split("|");
      const payload = JSON.parse(objString);
      const signForCheck = await this._encode(objString);
      if (signForCheck === sign) return payload;

      return null;
    } catch (e) {
      return null;
    }
  }

  private async _encode(payload: string): Promise<string> {
    const [pre, post] = this.secret.split("|");
    const stringForSign = `${pre}${payload}${post}`;
    const msgBuffer = new TextEncoder().encode(stringForSign);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

    return Buffer.from(hashBuffer).toString("base64");
  }
}