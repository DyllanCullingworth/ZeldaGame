

function immune(obj, time) {
    if (obj.immune == false) {
        obj.immune = true;
        wait(time, () => {
            obj.immune = false;
        })
    }
}

function health(hp) {
    return {
        // comp id (if not it'll be treated like custom fields on the game object)
        id: "health",
        // comp dependencies (will throw if the host object doesn't contain these components)
        require: [],
        // custom behaviors
        hurt(n) {
            if (!this.immune) {
                hp -= n ?? 1;
                // trigger custom events
                this.trigger("hurt");
                if (hp <= 0) {
                    this.trigger("death");
                }
            }

        },
        heal(n) {
            hp += n ?? 1;
            this.trigger("heal");
        },
        hp() {
            return hp;
        },
    };
}