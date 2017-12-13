import { expect } from "chai";
import getDecorators from "../src/index";
import { Container, injectable, inject } from "inversify";

describe("Issue inversify/InversifyJS/issues/685", () => {

    it("Should throw exception if circular dependencies are declared in a single file", () => {

        const container = new Container();
        const { lazyInject } = getDecorators(container);

        @injectable()
        class Dom {
            public domUi: DomUi;
            constructor (
                domUi: DomUi
            ) {
                this.domUi = domUi;
            }
        }

        @injectable()
        class DomUi {
            @lazyInject(Dom) public dom: Dom;
        }

        @injectable()
        class Test {
            public dom: Dom;
            constructor(
                dom: Dom
            ) {
                this.dom = dom;
            }
        }

        container.bind<Dom>(Dom).toSelf().inSingletonScope();
        container.bind<DomUi>(DomUi).toSelf().inSingletonScope();

        function throws() {
            return container.resolve(Test);
        }

        // This error may seem a bit misleading because when using
        // classes as service indentifiers @inject anotations should
        // not be required and if we do add an annotation like
        // @inject(Dom) or @inject(DomUi) we will still get the same
        // exception. This happens because at point in time in which
        // the decorator is invoked, the class has not been declared
        // so the decorator is invoked as @inject(undefined). This
        // trigger inversify to think that the annotation was never
        // added. The solution is to use Symbols as service identifiers.
        expect(throws).to.throw(
            "Missing required @inject or @multiInject annotation in: argument 0 in class Dom."
        );

    });

    it("Should be able to resolve lazy circular dependencies", () => {

        const container = new Container();
        const { lazyInject } = getDecorators(container);

        const TYPE = {
            Dom: Symbol.for("Dom"),
            DomUi: Symbol.for("DomUi")
        };

        @injectable()
        class DomUi {
            public dom: Dom;
            public name: string;
            constructor (
                @inject(TYPE.Dom) dom: Dom
            ) {
                this.dom = dom;
                this.name = "DomUi";
            }
        }

        @injectable()
        class Dom {
            public name: string;
            @lazyInject(TYPE.DomUi) public domUi: DomUi;
            public constructor() {
                this.name = "Dom";
            }
        }

        @injectable()
        class Test {
            public dom: Dom;
            constructor(
                @inject(TYPE.Dom) dom: Dom
            ) {
                this.dom = dom;
            }
        }

        container.bind<Dom>(TYPE.Dom).to(Dom).inSingletonScope();
        container.bind<DomUi>(TYPE.DomUi).to(DomUi).inSingletonScope();

        const test = container.resolve(Test);

        expect(test.dom.name).eq("Dom");
        expect(test.dom.domUi.name).eq("DomUi");
        expect(test.dom.domUi.dom.name).eq("Dom");
        expect(test.dom).eq(test.dom.domUi.dom);
        expect(test.dom.domUi).eq(test.dom.domUi.dom.domUi);

    });

});
