import { expect } from "chai";
import getDecorators from "../src/index";
import { Kernel, injectable, tagged, named } from "inversify";

describe("inversify-inject-decorators", () => {

    let TYPES = { Weapon: "Weapon" };

    interface Weapon {
        name: string;
        durability: number;
        use(): void;
    }

    @injectable()
    class Sword implements Weapon {
        public name: string;
        public durability: number;
        public constructor() {
            this.durability = 100;
            this.name = "Sword";
        }
        public use() {
            this.durability = this.durability - 10;
        }
    }

    @injectable()
    class Shuriken implements Weapon {
        public name: string;
        public durability: number;
        public constructor() {
            this.durability = 100;
            this.name = "Shuriken";
        }
        public use() {
            this.durability = this.durability - 10;
        }
    }

    it("Should support named constraints", () => {

        let kernel = new Kernel();

        let {
            lazyInjectNamed,
        } = getDecorators(kernel);

        class Warrior {

            @lazyInjectNamed(TYPES.Weapon, "not-throwwable")
            @named("not-throwwable")
            public primaryWeapon: Weapon;

            @lazyInjectNamed(TYPES.Weapon, "throwwable")
            @named("throwwable")
            public secondaryWeapon: Weapon;

        }

        kernel.bind<Weapon>(TYPES.Weapon).to(Sword).whenTargetNamed("not-throwwable");
        kernel.bind<Weapon>(TYPES.Weapon).to(Shuriken).whenTargetNamed("throwwable");

        let warrior1 = new Warrior();

        expect(warrior1.primaryWeapon).to.be.instanceof(Sword);
        expect(warrior1.secondaryWeapon).to.be.instanceof(Shuriken);

    });

    it("Should support tagged constraints", () => {

        let kernel = new Kernel();

        let {
            lazyInjectTagged
        } = getDecorators(kernel);

        class Warrior {

            @lazyInjectTagged(TYPES.Weapon, "throwwable", false)
            @tagged("throwwable", false)
            public primaryWeapon: Weapon;

            @lazyInjectTagged(TYPES.Weapon, "throwwable", true)
            @tagged("throwwable", true)
            public secondaryWeapon: Weapon;

        }

        kernel.bind<Weapon>(TYPES.Weapon).to(Sword).whenTargetTagged("throwwable", false);
        kernel.bind<Weapon>(TYPES.Weapon).to(Shuriken).whenTargetTagged("throwwable", true);

        let warrior1 = new Warrior();
        expect(warrior1.primaryWeapon).to.be.instanceof(Sword);
        expect(warrior1.secondaryWeapon).to.be.instanceof(Shuriken);

    });

    it("Should support multi injections", () => {

        let kernel = new Kernel();

        let {
            lazyMultiInject
        } = getDecorators(kernel);

        class Warrior {

            @lazyMultiInject(TYPES.Weapon)
            public weapons: Weapon[];

        }

        kernel.bind<Weapon>(TYPES.Weapon).to(Sword).whenTargetTagged("throwwable", false);
        kernel.bind<Weapon>(TYPES.Weapon).to(Shuriken).whenTargetTagged("throwwable", true);

        let warrior1 = new Warrior();
        expect(warrior1.weapons[0]).to.be.instanceof(Sword);
        expect(warrior1.weapons[1]).to.be.instanceof(Shuriken);

    });

    it("Should NOT break the property setter", () => {

        let kernel = new Kernel();

        let {
            lazyInject
        } = getDecorators(kernel);

        class Warrior {
            @lazyInject(TYPES.Weapon)
            public weapon: Weapon;
        }

        kernel.bind<Weapon>(TYPES.Weapon).to(Sword);

        let warrior1 = new Warrior();
        expect(warrior1.weapon).to.be.instanceof(Sword);
        warrior1.weapon = new Shuriken();
        expect(warrior1.weapon).to.be.instanceof(Shuriken);

        let warrior2 = new Warrior();
        warrior2.weapon = new Shuriken();
        expect(warrior2.weapon).to.be.instanceof(Shuriken);

    });

});

