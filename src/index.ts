import { interfaces } from "inversify";

import {
    makePropertyInjectDecorator,
    makePropertyMultiInjectDecorator,
    makePropertyInjectTaggedDecorator,
    makePropertyInjectNamedDecorator
} from "./decorators";


function getDecorators(kernel: interfaces.Kernel) {

    let lazyInject = makePropertyInjectDecorator(kernel);
    let lazyInjectNamed = makePropertyInjectNamedDecorator(kernel);
    let lazyInjectTagged = makePropertyInjectTaggedDecorator(kernel);
    let lazyMultiInject = makePropertyMultiInjectDecorator(kernel);

    return {
       lazyInject ,
       lazyInjectNamed,
       lazyInjectTagged,
       lazyMultiInject
    };

}

export default getDecorators;
