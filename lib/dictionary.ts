export class Dictionary<T> {

    constructor(private ids: string[] = [], private entities: { [key: string]: T } = {}) {
    }

    toArray() {
        return this.ids.map(id => this.entities[id]);
    }

    get length() {
        return this.ids.length;
    }

    add(id: string, item: T): Dictionary<T> {
        const found = this.ids.some(_id => _id === id);
        return new Dictionary<T>(found ? this.ids : [...this.ids, id], {...this.entities, [id]: item});
    }

    find(id: string) {
        return this.entities[id];
    }

    remove(item: T): Dictionary<T> {
        const ids = this.ids.filter((id) => {
            const entity = this.find(id);
            return entity && entity === item;
        });

        // When nothing gets deleted.
        if (!ids.length) {
            return this;
        }

        const entities = ids.reduce((entities, id) => {
            delete entities[id];
            return entities;
        }, Object.assign({}, this.entities));

        return new Dictionary<T>(ids, entities);
    }
}
