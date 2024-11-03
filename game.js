// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Vector = Matter.Vector,
    Events = Matter.Events,
    Constraint = Matter.Constraint;

// create an engine
var engine = Engine.create({
    gravity: Vector.create(0, 0)
});
