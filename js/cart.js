class Cart {
    constructor() {
        this.items = [];
        this.whatsappNumber = "5521971307932";
    }

    add(bike) {
        const exists = this.items.find(item => item.id === bike.id);
        if (exists) {
            exists.quantity += 1;
        } else {
            this.items.push({ ...bike, quantity: 1 });
        }
        this.save();
    }

    remove(bikeId) {
        this.items = this.items.filter(item => item.id !== bikeId);
        this.save();
    }

    getTotal() {
        return this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }

    save() {
        if(window.UI) window.UI.updateCart();
    }

    getWhatsAppLink() {
        if (this.items.length === 0) return "#";

        let text = `Olá, Mult Bikes! Vim pelo Instagram e tenho interesse nas seguintes bikes:%0A%0A`;
        
        this.items.forEach(item => {
            text += `- ${item.quantity}x ${item.name} (R$ ${item.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})})%0A`;
        });

        text += `%0A*Total Estimado: R$ ${this.getTotal().toLocaleString('pt-BR', {minimumFractionDigits: 2})}*%0A%0A`;
        text += `Podemos fechar o pedido?`;

        return `https://wa.me/${this.whatsappNumber}?text=${text}`;
    }
}

const cart = new Cart();
