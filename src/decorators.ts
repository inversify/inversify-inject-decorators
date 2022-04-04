import { interfaces } from "inversify";

const INJECTION = Symbol.for("INJECTION");

function _proxyGetter(
    proto: any,
    key: string,
    resolve: () => any,
    doCache: boolean,
    desc : any
) {
    function getter() {
        if (doCache && !Reflect.hasMetadata(INJECTION, this, key)) {
            Reflect.defineMetadata(INJECTION, resolve(), this, key);
        }
        if (Reflect.hasMetadata(INJECTION, this, key)) {
            return Reflect.getMetadata(INJECTION, this, key);
        } else {
            return resolve();
        }
    }

    function setter(newVal: any) {
        Reflect.defineMetadata(INJECTION, newVal, this, key);
    }

    Object.assign(desc,{
        configurable: true,
        enumerable: true,
        get: getter,
        set: setter
    });

    Object.defineProperty(proto, key, desc``);
}

function makePropertyInjectDecorator(container: interfaces.Container, doCache: boolean) {
    return function(serviceIdentifier: interfaces.ServiceIdentifier<any>) {
        return function(proto: any, key: string, desc: any): void {

            let resolve = () => {
                return container.get(serviceIdentifier);
            };

            _proxyGetter(proto, key, resolve, doCache,desc);

        };
    };
}

function makePropertyInjectNamedDecorator(container: interfaces.Container, doCache: boolean) {
    return function(serviceIdentifier: interfaces.ServiceIdentifier<any>, named: string) {
        return function(proto: any, key: string,desc:any): void {

            let resolve = () => {
                return container.getNamed(serviceIdentifier, named);
            };

            _proxyGetter(proto, key, resolve, doCache,desc);

        };
    };
}

function makePropertyInjectTaggedDecorator(container: interfaces.Container, doCache: boolean) {
    return function(serviceIdentifier: interfaces.ServiceIdentifier<any>, key: string, value: any) {
        return function(proto: any, propertyName: string,desc:any): void {

            let resolve = () => {
                return container.getTagged(serviceIdentifier, key, value);
            };

            _proxyGetter(proto, propertyName , resolve, doCache,desc);

        };
    };
}

function makePropertyMultiInjectDecorator(container: interfaces.Container, doCache: boolean) {
    return function(serviceIdentifier: interfaces.ServiceIdentifier<any>) {
        return function(proto: any, key: string, desc:any): void {

            let resolve = () => {
                return container.getAll(serviceIdentifier);
            };

            _proxyGetter(proto, key, resolve, doCache,desc);

        };
    };
}

export {
    makePropertyInjectDecorator,
    makePropertyMultiInjectDecorator,
    makePropertyInjectTaggedDecorator,
    makePropertyInjectNamedDecorator
};
