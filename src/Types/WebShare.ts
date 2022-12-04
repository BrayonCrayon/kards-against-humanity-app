export interface ShareData {
  title: string;
  text: string;
  url: string;
  data?: object | string;
}

export const defaultShareData: ShareData = {
  text: "",
  title: "",
  url: ""
}

export class WebShare {
  public canShare(data: ShareData): boolean {
    return navigator.canShare(data);
  }

  public async share(data: ShareData = defaultShareData): Promise<void> {
    if (!this.canShare(data)) return;

    await navigator.share(data);
  }
}

export const webShare = new WebShare();