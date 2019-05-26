var turns;
var drop;
var mouse = false;
var player = {};
var enemy = {};
var damage = {
    physical: 0,
    bleed: 0,
    fire: 0,
    water: 0,
    ice: 0,
    electric: 0,
    air: 0,
    light: 0,
}
var stackDamage = {
    physical: 0,
    bleed: 0,
    fire: 0,
    water: 0,
    ice: 0,
    electric: 0,
    air: 0,
    light: 0,
}
var stackDamageDecline = {
    physical: 0,
    bleed: 0,
    fire: 0,
    water: 0,
    ice: 0,
    electric: 0,
    air: 0,
    light: 0,
}
var item1 = {};
var item2 = {};
var item3 = {};
var item4 = {};
var item5 = {};
var item6 = {};

//WORD TYPES: electric, fire, water, wind, cold, rangedphysical, sharp, dull

//weapons: [name], [damage type], [damage amount], [stack damage type], [stack damage amount], [stack damage decline per turn], [cooldown in turns], [word type], [tooltip]
const weapons = [
    "sword", "physical", 30, null, 0, 0, 0, "sharp", "Deals 30 physical damage.",
    "ancient sword", "physical", 60, null, 0, 0, 1, "sharp", "Deals 60 physical damage. Has a 1 turn cooldown.",
    "bat", "physical", 22, null, 0, 0, 0, "dull", "Deals 22 physical damage.",
    "club", "physical", 27, null, 0, 0, 0, "dull", "Deals 27 physical damage.",
    "dagger", "physical", 30, "bleed", 10, 1, 1, "sharp", "Deals 30 physical damage with an additional 10 stack damage that has a decline of 1 per turn.",
    "flail", "physical", 37, null, 0, 0, 0, "dull", "Deals 37 physical damage.",
    "hell axe", "physical", 34, "fire", 19, 2, 1, "sharp", "Deals 34 physical damage with an additional 19 stack damage that has a decline of 2 per turn. Has a 1 turn cooldown.",
    "bow", "physical", 40, null, 0, 0, 1, "rangedphysical", "Deals 40 ranged physical damage with a 1 turn cooldown.",
    "magic ring", "light", 17, "light", 11, 3, 0, "dull", "Deals 17 light damage with an additional 11 stack damage that declines by 3 per turn.",
];

//damage spells: [name], [passive spell - FALSE], [damage type], [damage amount], [stack damage], [stack damage decline per turn], [cooldown in turns], [effect], [effect stat], [effect chance], [effect length], [spell mana cost], [word type], [tooltip]
//passive spells: [name], [passive spell - TRUE], [spell type], [0 damage], [damage resist], [damage resist decline per turn], [cooldown in turns], [effect], [effect stat], [effect chance], [effect length], [spell mana cost], [null], [tooltip]
//effects:
//stun - enemy can't attack for [effect length] number of turns
//heal - player is healed for [effect stat] health
//flame - [effect stat]% bonus stack damage on weapon type
//freeze - [effect stat]% bonus stack damage on weapon type
//shock - [effect stat]% bonus stack damage on weapon type
//blind - enemy has [effect stat]% more chance to miss attacks
//manastacks - [effect chance]% chance to get [effect stat] more max mana when hitting an enemy

//refresh ("refresh" ability specific) - all your cooldowns are reset
const spells = [
    "ice needles", false, "ice", 27, 5, 4, 1, "freeze", .32, .5, 0, 8, "cold", "Deals 27 ice damage with 5 additional stack damage that declines by 4 per turn. Has a 50% precent chance to deal 32% more damage. It has a 1 turn cooldown and takes 8 mana to use.",
    "glacial blast", false, "ice", 43, 7, 3, 6, "stun", 0, .6, 2, 15, "cold", "Deals 43 ice damage with 7 additional stack damage that declines by 3 per turn. Has a 60% precent chance to stun the enemy for 2 turns. It has a 6 turn cooldown and takes 15 mana to use.",
    "fireball", false, "fire", 34, 10, 3, 3, null, 0, 0, 0, 9, "fire", "Deals 34 ice damage with 10 stack damage that declines by 3 per turn. Has a 3 turn cooldown and costs 9 mana to use.",
    "sunlight fury", false, "fire", 29, 20, 4, 4, "flame", .14, .34, 0, 18, "fire", "Deals 29 fire damage and inflicts 20 stack damage that declines by 4 per turn. The spell has a 34% chance to deal 14% more damage. It has a 4 turn cooldown and needs 18 mana.",
    "boil", false, "water", 23, 12, 3, 3, null, 0, 0, 0, 7, "fire", "You launch boiling water at your opponent, dealing 23 water damage and 12 stack damage that declines by 3 per turn. Has a 3 turn cooldown and uses 7 mana.",
    "bolt", false, "electric", 31, 6, 1, 2, null, 0, 0, 0, 7, "electric", "Deals 31 electric damage with 6 stack damage that declines by 1 per turn. Has a cooldown of 2 turns and needs 7 mana",
    "tidal wave", false, "water", 45, 2, 1, 3, "freeze", .25, .15, 0, 20, "water", "You unleash a wave of water onto your opponentm dealing 45 water damage and 2 stack damage that declines by 1 per turn. Has a 15% chance to deal 25% more damage and has a 3 turn cooldown, needing 20 mana.",
    "splash", false, "water", 10, 4, 0, 1, "stun", 0, .10, 1, 7, "water", "", "You splash water onto your opponent, dealing 10 water damage and 4 physical damage that doesn't decline until another spell is used. Has a %10 chance to stun the enemy for 1 turn. It takes 7 mana to use and has a 3 turn cooldown.",
    "water shield", true, "water", 0, 10, 4, 3, "heal", 14, .76, 0, 11, null, "You shield yourself by manipulating water. You get 10 damage resistance that declines by 4 per turn. You have a 76% chance to heal yourself for 14 health. Has a 3 turn cooldown and takes 11 mana.",
    "quake stomp", false, "physical", 45, 10, 1, 4, "stun", 0, .4, 2, 20, "dull", "The user stomps the ground, dealing 45 physical damage and 10 stack damage with a decline of 1 per turn. Has a 40% chance to stun the enemy for 2 turns. Has a 4 turn cooldown and needs 20 mana.",
    "tornado", false, "air", 30, 10, 3, 2, null, 0, 0, 0, 12, "wind", "Deals 30 air damage and does 10 extra stack damage that declines by 3 per turn. Has a 2 turn cooldown and uses 12 mana.",
    "thunder beam", false, "electric", 30, 2, 1, 1, "shock", .14, .4, 0, 11, "electric", "Deals 30 electric damage and 2 stack damage that declines by 1 per turn. Has a 40% chance to do 14% more damage and takes 3 mana to use.",
    "electric sprint", true, "electric", 0, 15, 4, 3, null, 0, 0, 0, 4, null, "The user charges themselves with pure electricity and takes 15 less damage per hit. The damage resist fades by 4 per turn. It has a 3 turn cooldown and takes 4 mana to use.",
    "refresh", true, "electric", 0, 0, 0, 5, "refresh", 0, 1, 0, 20, null, "Resets the cooldowns of all of your weapons and spells. Has a 5 turn cooldown and costs 20 mana.",
    "sonic shout", false, "air", 23, 15, 4, 5, "stun", 0, .4, 1, 14, "wind", "Deals 23 air damage and 15 stack damage with a decline of 4 per turn. Has a 40% chance to stun the enemy for 1 turn. It has a 5 turn cooldown and costs 14 mana to use.",
    "blind", false, "air", 0, 0, 0, 4, "blind", .33, 1, 0, 13, null, "Makes the enemy 33% more likely to miss their attacks. Has a 4 turn cooldown and takes 13 mana to use.",
    "spark", false, "electric", 25, 15, 7, 0, "shock", .12, .6, 0, 7, "electric", "Deals 25 electric damage and 15 stack damage that declines by 7 per turn. Has a 60% chance to deal 12% extra damage and takes 7 mana to use.",
];

//statBuffs: [item that provides it], [stat it increases], [by how much extra per level], [tooltip]
const statBuffs = [
    "magic ring", "maxmana", 5, "Gain 5 extra max mana per level up",
    "strength band", "strength", 2, "Gain 2 extra strength per level up.",
    "spell book", "intellect", 4, "Gain 4 extra intellect per level up.",
    "necklace of luck", "bonusdamage", .05, "Gain 5% bonus damage per level up.",
    "manaflow band", "manaregen", 1, "Gain 1 extra mana regen per level up.",
    "silk band", "maxhealth", 5, "Gain 5 extra max health per level up.",
]

//consumables: [name], [hp heal], [max hp increase], [strength increase], [incoming damage decrease], [regen increase], [intellect increase], [mana recover], [max mana increase], [speed increase], [tooltip]
const consumables = [
    "potion", 50, 0, 0, 0, 0, 0, 0, 0, 0, "Recovers 50 HP."
];

//enemies

//TIER 1 TURNS 0 - 60
var encounters1 = ["goblin", "orc", "reptilian"];

var goblin = { name: "goblin", health: 100, damage: 10, damageResist: 0, missChance: .22, speed: 24, messageType: "enemyranged", xp: 150, drop1Chance: .60, drop1: "potion", drop2Chance: .19, drop2: "bow", };
var orc = { name: "orc", health: 150, damage: 20, damageResist: 0, missChance: .31, speed: 14, messageType: "enemydull", xp: 300, drop1Chance: .4, drop1: "strength band", };
var reptilian = { name: "reptilian", health: 200, damage: 15, damageResist: 10, missChance: .14, speed: 20, messageType: "enemysharp", xp: 450, drop1Chance: .15, drop1: "sonic shout", };

//TIER 2 TURNS 60 - 120
var encounters2 = ["ghoul", "spider", "watermage"];

var ghoul = { name: "ghoul", health: 60, damage: 25, damageResist: 3, missChance: .22, speed: 15, messageType: "monster", xp: 250, }
var spider = { name: "spider", health: 150, damage: 20, damageResist: 2, missChance: .05, speed: 50, messageType: "monster", xp: 500, drop1Chance: .60, drop1: "silk band" };
var watermage = { name: "water mage", health: 75, damage: 30, damageResist: 4, missChance: .11, speed: 40, messageType: "enemysharp", xp: 450, drop1Chance: .30, drop1: "boil", drop2Chance: .40, drop2: "spell book", }
//

//bosses
var icedragon = { name: "ice dragon", health: 2000, damage: 100, damageResist: 15, missChance: .05, speed: 100, messageType: "iceDragon", xp: 2000, drop1Chance: 1, drop: "glacial blast" }

function pickStarter() {
    document.getElementById("starter-selection").style.display = "flex";
    document.getElementById("title-screen").style.display = "none";
}

function starter(item) {
    item1.name = item;
    item1.cooldown = 0;

    start();
}

function start() {

    //player define
    player.health = 100;
    player.maxhealth = 100;
    player.mana = 50;
    player.maxmana = 50;
    player.strength = 0;
    player.intellect = 0;
    player.dmgresist = 0;
    player.regen = 1;
    player.manaregen = 3;
    player.bonusdamage = 0; //%
    player.speed = 30;

    player.level = 1;
    player.xpToNext = 200;
    player.neededThisLevel = 200;

    player.fighting = false;

    turns = 0;
    item2.name = "potion";

    update();

    //element displays
    document.getElementById("bot-bar").style.display = "flex";
    document.getElementById("starter-selection").style.display = "none";
    document.getElementById("main-buttons").style.display = "block";

    //update displays
    update("You wake up with a " + item1.displayName + " and a potion.", 1);
}

function levelUp() {
    player.level = player.level + 1;
    update("You have reached level " + player.level + ".", 3);

    //base stat modifiers
    player.health = player.health + 5;
    player.maxhealth = player.maxhealth + 5;
    player.mana = player.mana + 3;
    player.maxmana = player.maxmana + 3;
    player.strength = player.strength + 2;
    player.intellect = player.intellect + 2;
    player.dmgresist = player.dmgresist + 1;
    player.regen = player.regen + 1;
    player.manaregen = player.manaregen + 1;
    player.speed = player.speed + 4;

    //extra stat modifiers
    var i = 1;
    while (i <= 6) {
        if (window["item" + i].name != null && statBuffs.indexOf(window["item" + i].name) != undefined) { var itemID = statBuffs.indexOf(window["item" + i].name) }
        else { return; };
        var stat = statBuffs[itemID + 1];
        var extraIncrease = statBuffs[itemID + 2];
        player[stat] = player[stat] + extraIncrease;
        i = i + 1;
    }
}

function gainXP(xp) {
    player.xpToNext = player.xpToNext - xp;
    if (player.xpToNext <= 0) {
        levelUp();
        player.neededThisLevel = Math.round(player.neededThisLevel * 1.33);
        if (player.xpToNext < 0) {
            extraXP = player.xpToNext;
            player.xpToNext = player.neededThisLevel;
            gainXP(Math.abs(extraXP))
        }
        else {
            player.xpToNext = player.neededThisLevel;
        }
    }
}

function cont() {
    //general game updates
    turns = turns + 1;
    update();
    reduceCooldowns();

    //player variables updates
    player.health = player.health + player.regen;
    if (player.health > player.maxhealth) { player.health = player.maxhealth };
    player.mana = player.mana + player.manaregen;
    if (player.mana > player.maxmana) { player.mana = player.maxmana };

    var rng = Math.random()

    if (rng <= .15) {
        //enemy encounter
        player.fighting = true;
        //decide encounter level
        var encounterlevel = Math.floor(turns / 60) + 1;
        var encounters = window["encounters" + encounterlevel];
        enemy = Object.assign(enemy, window[encounters[Math.floor(Math.random() * encounters.length)]]);
        duplicateInv();
        update("clear", 1);
        update("You encounter a " + enemy.name + ".", 1);
        if (weaponCheck() == false) {
            update("clear", 3);
            update("You have no way to fight the " + enemy.name + ".", 3);
            die();
        }
        document.getElementById("main-buttons").style.display = "none";
    }
}

function item(itemSlot) {
    if (player.fighting == true && weapons.indexOf(window[itemSlot].name) >= 0) {
        weaponAttack(window[itemSlot], window[itemSlot].name);
    }
    else if (player.fighting == false && weapons.indexOf(window[itemSlot].name) >= 0) {
        //cant use weapons outside of battle
        console.log("weapons cannot be used outside of battle")
    }

    if (player.fighting == true && spells.indexOf(window[itemSlot].name) >= 0) {
        spell(window[itemSlot], window[itemSlot].name);
    }
    else if (player.fighting == false && spells.indexOf(window[itemSlot].name) >= 0) {
        //cant use spells outside of battle
        console.log("spells cannot be used outside of battle")
    }

    if (consumables.indexOf(window[itemSlot].name) >= 0) {
        consume(window[itemSlot], window[itemSlot].name);
    }
}

function spell(spellObject, spellName) {
    var spellID = spells.indexOf(spellName);
    var purpose = spells[spellID + 1];
    var type = spells[spellID + 2];
    var baseDamage = spells[spellID + 3];
    var stackingDamage = spells[spellID + 4];
    var damageDecline = spells[spellID + 5];
    var cooldown = spells[spellID + 6];
    var effect = spells[spellID + 7];
    var effectStat = spells[spellID + 8]
    var effectChance = spells[spellID + 9];
    var effectLength = spells[spellID + 10];
    var manaCost = spells[spellID + 11];

    if (manaCost > player.mana) {
        //not enough mana
        update("clear", 1);
        update("clear", 2);
        update("You don't have enough mana for the " + spellName + " spell.", 1);
        return;
    }
    if (spellObject.cooldown != 0) {
        //cooldown not over
        update("clear", 1);
        update("clear", 2);
        update("The " + spellName + " spell is still on cooldown.", 1);
        return;
    }
    if (purpose == true) {
        passiveSpell(spellObject, spellName);
        return;
    }

    damage[type] = damage[type] + baseDamage;
    if (stackDamage[type] == 0) {
        stackDamage[type] = stackDamage[type] + stackingDamage;
        stackDamage[type] = Math.round(stackDamage[type] * ((player.intellect / 100) + 1));
    }
    if (stackDamageDecline[type] == 0) {
        stackDamageDecline[type] = stackDamageDecline[type] + damageDecline;
    }
    damage[type] = Math.round(damage[type] * ((player.intellect / 100) + 1));

    reduceCooldowns();
    turns = turns + 1;
    if (enemy.stun != undefined && enemy.stun > 0) {
        enemy.stun = enemy.stun - 1;
    }
    spellObject.cooldown = cooldown;
    player.mana = player.mana - manaCost;

    //effects
    if (Math.random() <= effectChance) {
        if (effect == "stun") {
            enemy.stun = effectLength;
        }
        if (effect == "heal") {
            player.health = player.health + effectStat;
            if (player.health > player.maxhealth) { player.health = player.maxhealth };
        }
        if (effect == "flame" || effect == "shock" || effect == "freeze") {
            stackDamage[type] = stackDamage[type] * (1 + effectStat);
        }
        if (effect == "blind") {
            enemy.missChance = enemy.missChance + effectStat;
        }
    }

    //turns
    if (player.speed >= enemy.speed) {
        damageApply(true, spellName, spells[spellID + 12], spellObject);
        enemyAttack(false);
    }
    else {
        enemyAttack(true);
        damageApply(false, spellName, spells[spellID + 12], spellObject);
    }
    damage[type] = 0;

}

function passiveSpell(spellObject, spellName) {
    var spellID = spells.indexOf(spellName);
    var type = spells[spellID + 2];
    var dmgResist = spells[spellID + 4];
    var dmgResistDecline = spells[spellID + 5];
    var cooldown = spells[spellID + 6];
    var effect = spells[spellID + 7];
    var effectStat = spells[spellID + 8]
    var effectChance = spells[spellID + 9];
    var effectLength = spells[spellID + 10];
    var manaCost = spells[spellID + 11];

    if (manaCost > player.mana) {
        //not enough mana
        update("clear", 1);
        update("clear", 2);
        update("You don't have enough mana for the " + spellName + " spell.", 1);
        return;
    }
    if (spellObject.cooldown != 0) {
        //cooldown not over
        update("clear", 1);
        update("clear", 2);
        update("The " + spellName + " spell is still on cooldown.", 1);
        return;
    }

    if (player.tempResist > 0) {
        player.tempResist = player.tempResist - dmgResistDecline;
        if (player.tempResist < 0) { player.tempResist = 0 };
    }
    else {
        player.tempResist = player.tempResist + dmgResist;
    }

    if (Math.random() <= effectChance) {
        if (effect == "refresh") {
            var i = 1;
            while (i <= 6) {
                var item = window["item" + i];
                item.cooldown = 0;
                i = i + 1;
            }
        }
        if (effect == "heal") {
            player.health = player.health + effectStat;
        }
    }

    reduceCooldowns();
    spellObject.cooldown = cooldown;
    player.mana = player.mana - manaCost
}

function weaponAttack(weaponObject, weaponName) {
    var weaponID = weapons.indexOf(weaponName);
    var type = weapons[weaponID + 1];
    var baseDamage = weapons[weaponID + 2];
    var stackType = weapons[weaponID + 3];
    var stackingDamage = weapons[weaponID + 4];
    var damageDecline = weapons[weaponID + 5];
    var cooldown = weapons[weaponID + 6];

    if (weaponObject.cooldown != 0) {
        //cooldown not over
        update("clear", 1);
        update("clear", 2);
        update("The " + weaponName + " is still on cooldown.", 1);
        return;
    }

    //count damage
    damage[type] = damage[type] + baseDamage;
    damage[type] = Math.round(damage[type] * ((player.strength / 100) + 1));
    if (stackType != null && stackDamage != 0 && stackDamage[stackType] == 0) {
        stackDamage[stackType] = stackDamage[stackType] + stackingDamage;
        stackDamage[type] = Math.round(stackDamage[stackType] * ((player.strength / 100) + 1));
    };
    if (stackType != null && stackDamageDecline[type] == 0) {
        stackDamageDecline[stackType] = stackDamageDecline[stackType] + damageDecline;
    }

    reduceCooldowns();
    turns = turns + 1;
    weaponObject.cooldown = cooldown;

    //turns
    if (player.speed >= enemy.speed) {
        damageApply(true, weaponName, weapons[weaponID + 7], weaponObject);
        enemyAttack(false);
    }
    else {
        enemyAttack(true);
        damageApply(false, weaponName, weapons[weaponID + 7], weaponObject);
    }
    damage[type] = 0;
}

function damageApply(attackPriority, weaponName, messageType, weaponObject) {
    const sumValues = obj => Object.values(obj).reduce((a, b) => a + b);

    //start damage counting
    var totalDamage = sumValues(damage);
    var totalStack = sumValues(stackDamage);
    var total = totalDamage + totalStack;
    //var total = total + ((Math.random() * 30) * Math.random()); RNG FACTOR

    total = Math.round(total);
    total = total - enemy.damageResist;
    enemy.health = enemy.health - total;

    //messages
    if (attackPriority == true) {
        update("clear", 1);
        update("You " + findVerb(messageType) + " the " + enemy.name + " with your " + weaponObject.displayName + ", dealing " + total + " damage.", 1);
    }
    else {
        update("clear", 2);
        update("You " + findVerb(messageType) + " the " + enemy.name + " with your " + weaponObject.displayName + ", dealing " + total + " damage.", 2);
    }

    //reduce stack damage
    Object.keys(stackDamage).forEach(function (key, index) {
        stackDamage[key] = stackDamage[key] - stackDamageDecline[key];
        if (stackDamage[key] < 0) { stackDamage[key] = 0 };
    });

    if (enemy.health <= 0) {
        update("clear", 3)
        update("The " + enemy.name + " dies.", 3)
        player.fighting = false;
        gainXP(enemy.xp);
        resetInvDup();
        document.getElementById("loot-screen").style.display = "block";
        enemy.dead = true;
    }
}

function enemyAttack(attackPriority) {
    if (enemy.dead != true) {
        if (enemy.stun == undefined || enemy.stun == 0) {
            if (Math.random() >= enemy.missChance) {

                //turns = turns + 1;
                var damageTaken = enemy.damage - player.dmgresist;
                player.health = player.health - damageTaken;

                if (attackPriority == true) {
                    update("clear", 1);
                    update("The " + enemy.name + " " + findVerb(enemy.messageType) + " you, dealing " + damageTaken + " damage.", 1);
                }
                else {
                    update("clear", 2);
                    update("The " + enemy.name + " " + findVerb(enemy.messageType) + " you, dealing " + damageTaken + " damage.", 2);
                }
            }
            else {
                if (attackPriority == true) {
                    update("clear", 1);
                    update("The " + enemy.name + " missed their attack.", 1);
                }
                else {
                    update("clear", 2);
                    update("The " + enemy.name + " missed their attack.", 2);
                }
            }

            /*if (weaponCheck == false) {
                if (attackPriority == false) {
                    update("clear", 1);
                    update("You have no usable weapons.", 1);
                }
                else {
                    update("clear", 2);
                    update("You have no usable weapons.", 2);
                }
                reduceCooldowns();
            }*/
        }
        else {
            if (player.speed >= enemy.speed) {
                update("clear", 2);
                update("The " + enemy.name + " is stunned.", 2);
                enemy.stun = enemy.stun - 1;
            }
            else {
                update("clear", 1);
                update("The " + enemy.name + " is stunned.", 1);
                enemy.stun = enemy.stun - 1;
            }
        }
    }
    else {
        if (player.speed >= enemy.speed) {
            update("clear", 2);
        }
        else {
            update("clear", 1);
        }
    }

    if (weaponCheck() == false) {
        update("clear", 3);
        update("You have no way to fight the " + enemy.name + ".", 3);
        die();
    }

    if (player.health <= 0) {
        die();
    }
}

function consume(consumableObject, consName) {
    var consumableID = consumables.indexOf(consName);
    var heal = consumables[consumableID + 1];
    var hpinc = consumables[consumableID + 2];
    var strengthinc = consumables[consumableID + 3];
    var incomingaddec = consumables[consumableID + 4];
    var regeninc = consumables[consumableID + 5];
    var intellectinc = consumables[consumableID + 6];
    var manarec = consumables[consumableID + 7];
    var manainc = consumables[consumableID + 8];
    var speedinc = consumables[consumableID + 9];

    player.health = player.health + heal;
    player.maxhealth = player.maxhealth + hpinc;
    player.strength = player.strength + strengthinc;
    player.dmgresist = player.dmgresist + incomingaddec;
    player.regen = player.regen + regeninc;
    player.intellect = player.intellect + intellectinc;
    player.mana = player.mana + manarec;
    player.maxmana = player.maxmana + manainc;
    player.speed = player.speed + speedinc;

    if (player.health > player.maxhealth) { player.health = player.maxhealth }
    if (player.mana > player.maxmana) { player.mana = player.maxmana }

    consumableObject.used = true;

    update("clear", 1);
    update("You drink the " + consName + ".", 1);
    update("clear", 2);
}

function loot() {
    update("clear", 1);
    update("clear", 2);
    update("clear", 3);
    update("You loot the dead " + enemy.name + ".", 1);

    if (enemy.drop2Chance != null && enemy.drop2Chance >= Math.random()) {
        drop = enemy.drop2;
    }
    else if (enemy.drop1Chance != null && enemy.drop1Chance >= Math.random()) {
        drop = enemy.drop1;
    }

    if (drop != undefined) {
        update("You found a " + drop + ", do you want to pick it up?", 1);
        document.getElementById("loot-screen").style.display = "none";
        document.getElementById("pickUpQuery").style.display = "block";
    }
    else {
        update("The " + enemy.name + " didn't have anything.", 1);
        document.getElementById("loot-screen").style.display = "none";
        document.getElementById("main-buttons").style.display = "block";
        drop = undefined;
    }
    enemy = {};
}

function pickUp(choice) {
    if (choice == true) {
        var i = 1;
        while (window["item" + i].name != undefined) {
            i = i + 1;
        }
        if (i != 7) {
            window["item" + i].name = drop;
            update("clear", 1);
            update("You pick up the " + drop + ".", 1);
            printInv();
            document.getElementById("pickUpQuery").style.display = "none";
            document.getElementById("main-buttons").style.display = "block";
        }
        else {
            update("Your inventory is full.")
        }
    }
    else {
        update("clear", 1)
        update("You leave behind the " + drop + ".", 1)
    }
    drop = undefined;
}

function weaponCheck() {
    var i = 1;
    var hasWeapon = false;
    while (i <= 6) {
        var item = window["item" + i];
        if (weapons.indexOf(item.name) >= 0) {
            if (item.cooldown != 0) { }
            else {
                hasWeapon = true;
            }
        }
        else if (spells.indexOf(item.name) >= 0) {
            if (item.cooldown != 0 || spells[spells.indexOf(item.name) + 11] >= player.mana) { }
            else {
                hasWeapon = true;
            }
        }
        i = i + 1;
    }
    return hasWeapon;
}

function reduceCooldowns() {
    var i = 1;
    while (i <= 6) {
        var item = window["item" + i];
        if (item.cooldown != null && item.cooldown > 0) {
            item.cooldown = item.cooldown - 1;
        }
        else {
            item.cooldown = 0;
        }
        i = i + 1;
    }
    printInv();
}

function update(string, line) {
    printInv();
    fillBars();
    updateNames();
    document.getElementById("turns").innerHTML = "Turns: " + turns;

    if (string == null || string == "") {
        return;
    }
    var line = document.getElementById("line" + line);
    if (string == "clear") {
        line.innerHTML = "";
    }
    else {
        line.innerHTML = line.innerHTML + "<br> " + string;
    }
}

function updateNames() {
    var i = 1;
    while (i <= 6) {
        var item = window["item" + i];
        if (spells.indexOf(item.name) >= 0) {
            item.displayName = item.name + " spell";
        }
        else {
            item.displayName = item.name;
        }
        i = i + 1;
    }
}

function fillBars() {
    healthFill = Math.round((player.health / player.maxhealth) * 100);
    manaFill = Math.round((player.mana / player.maxmana) * 100);
    document.getElementById("healthFill").style.width = healthFill + "%";
    document.getElementById("manaFill").style.width = manaFill + "%";
}

function printInv() {
    organizeInv();
    var i = 1;
    while (i <= 6) {
        var item = window["item" + i];
        var slot = document.getElementById("item" + i);
        slot.innerHTML = "";

        if (item.used == true) {
            window["item" + i] = {};
            item = {};
        }

        var img = document.createElement("img");

        if (item.cooldown != undefined && item.cooldown > 0) {
            img.style.opacity = "0.5";
            var cooldownDisplay = document.createElement("h1");
            cooldownDisplay.innerText = item.cooldown
            cooldownDisplay.style.position = "absolute";
            cooldownDisplay.style.zIndex = "1";
            cooldownDisplay.style.color = "white";
            cooldownDisplay.style.marginLeft = "2%";
            img.style.zIndex = "-1";
            slot.appendChild(cooldownDisplay);
        }

        if (weapons.indexOf(item.name) >= 0) {
            var folder = "weapons";
        }
        else if (spells.indexOf(item.name) >= 0) {
            var folder = "spells";
        }
        else if (consumables.indexOf(item.name) >= 0) {
            var folder = "consumables"
        }
        else if (statBuffs.indexOf(item.name) >= 0) {
            var folder = "statboostspecific"
        }
        else {
            return;
        }

        img.src = folder + "/" + item.name + ".png";
        img.style.width = "100%"
        img.style.height = "99.99%"
        slot.setAttribute("onclick", "item(this.id);");
        slot.appendChild(img);
        i = i + 1;
    }
}

function duplicateInv() {
    printInv();
    var inventory = document.getElementById("inventory");
    var copy = document.createElement("div");
    var displays = document.getElementById("displays");
    copy.innerHTML = inventory.innerHTML;
    copy.style.width = "33%";
    copy.style.height = "100px";
    copy.style.display = "flex";
    copy.style.marginTop = "200px";
    copy.setAttribute("id", "copy");
    displays.appendChild(copy);
    inventory.innerHTML = "<h1> In fight. </h1>";

}

function resetInvDup() {
    var inventory = document.getElementById("copy");
    var oldslot = document.getElementById("inventory");
    var displays = document.getElementById("displays");
    oldslot.innerHTML = inventory.innerHTML;
    displays.removeChild(inventory);
}

function organizeInv() {
    var i = 1;
    var iterations = 0;
    while (i <= 5 && iterations <= 10) {
        var item = window["item" + i];
        var nextitem = window["item" + (i + 1)];
        if (item.name == undefined && nextitem.name != undefined) {
            window["item" + i] = Object.assign(window["item" + i], window["item" + (i + 1)]);
            window["item" + (i + 1)] = {};
        }
        i = i + 1;
    }
    if (i = 5) {
        iterations = iterations + 1;
        i = 1;
    }
}

function mouseStatus(x, id) {
    mouse = x;
    if (mouse == true) {
        showToolTip(id)
    }
    else {
        document.getElementById("tooltip").innerHTML = "";
    }
}

function showToolTip(id) {
    var item = window[id];
    if (weapons.indexOf(item.name) >= 0) {
        var tooltip = weapons[weapons.indexOf(item.name) + 8];
    }
    else if (spells.indexOf(item.name) >= 0) {
        var tooltip = spells[spells.indexOf(item.name) + 13];
    }
    else if (consumables.indexOf(item.name) >= 0) {
        var tooltip = consumables[consumables.indexOf(item.name) + 10];
    }
    else if (statBuffs.indexOf(item.name) >= 0) {
        var tooltip = statBuffs[statBuffs.indexOf(item.name) + 3];
    }
    document.getElementById("tooltip").innerHTML = tooltip;
}

function die() {
    var interface = Array.from(document.getElementsByClassName("game"));
    var i = 0;
    while (i < interface.length) {
        interface[i].style.display = "none";
        i = i + 1;
    }
    update("You died.", 3);
    resetInvDup();
    document.getElementById("bot-bar").style.display = "flex";
    document.getElementById("inventory").innerHTML = "";
}

//Verb Types: electric, fire, water, wind, rangedphysical, sharp, dull, cold
var electricWords = ["shock", "strike", "fry", "electrocute", "jolt"];
var fireWords = ["burn", "cook", "sizzle", "scorch", "light up", "torture"];
var waterWords = ["splash", "drown", "hit",];
var windWords = ["hit", "push", "twist", "knock back"];
var rangedphysicalWords = ["shoot", "impale", "penetrate", "destroy", "olbiterate"];
var sharpWords = ["slit", "stab", "impale", "cut", "repeatedly stab", "chop up", "slash"];
var dullWords = ["hit", "crush", "obliterate", "destroy", "break",];
var coldWords = ["freeze", "frost", "strike", "hit", "cut", "crush",];
//specific to enemies
var enemysharpWords = ["slits", "stabs", "impales", "cuts", "repeatedly stabs", "slashes"];
var enemydullWords = ["hits", "crushes", "obliterates", "destroys", "breaks", "smashes"];
var enemyrangedWords = ["shoots", "impales", "penetrates", "destroys", "obliterates"];
var monsterWords = ["bites", "slashes", "scratches", "cuts", "rams", "chomps", "crunches"];
//specific to certain bosses
var iceDragonWords = ["bites", "slams", "freezes", "hits", "smashes", "strikes", "obliterates"];

function findVerb(verbType) {
    var array = window[verbType + "Words"];
    return array[Math.floor(Math.random() * array.length)];
}