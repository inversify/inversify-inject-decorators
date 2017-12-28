import { interfaces } from "inversify";

import {
    makePropertyInjectDecorator,
    makePropertyMultiInjectDecorator,
    makePropertyInjectTaggedDecorator,
    makePropertyInjectNamedDecorator
} from "./decorators";


function getDecorators(container: interfaces.Container, doCache = true) {

    let lazyInject = makePropertyInjectDecorator(container, doCache);
    let lazyInjectNamed = makePropertyInjectNamedDecorator(container, doCache);
    let lazyInjectTagged = makePropertyInjectTaggedDecorator(container, doCache);
    let lazyMultiInject = makePropertyMultiInjectDecorator(container, doCache);

    return {
       lazyInject ,
       lazyInjectNamed,
       lazyInjectTagged,
       lazyMultiInject
    };

}

export default getDecorators;
