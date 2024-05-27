interface HxRComposeImpl {
    onHxCompose(e: Event): void;
}

class HxRCompose implements HxRComposeImpl {
    constructor() {
        this.onHxCompose = this.onHxCompose.bind(this);
    }

    onHxCompose(e: Event): void {        

    }
}