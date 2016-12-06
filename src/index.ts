import { interfaces } from "inversify";

import {
    makePropertyInjectDecorator,
    makePropertyMultiInjectDecorator,
    makePropertyInjectTaggedDecorator,
    makePropertyInjectNamedDecorator
} from "./decorators";


function getDecorators(container: interfaces.Container) {

    let lazyInject = makePropertyInjectDecorator(container);
    let lazyInjectNamed = makePropertyInjectNamedDecorator(container);
    let lazyInjectTagged = makePropertyInjectTaggedDecorator(container);
    let lazyMultiInject = makePropertyMultiInjectDecorator(container);

    return {
       lazyInject ,
       lazyInjectNamed,
       lazyInjectTagged,
       lazyMultiInject
    };

}

export default getDecorators;
