import React, { useEffect, useRef, useState } from 'react';
import { Engine, Render, World, Bodies, Body, Composite } from 'matter-js';
import { ControlPanel } from './ControlPanel';
import { toast } from "sonner";
import { BackgroundColorPicker } from './BackgroundColorPicker';
import { BoundaryDrawer } from './BoundaryDrawer';

export type ShapeType = 'circle' | 'square' | 'triangle' | 'pentagon' | 'hexagon';

export interface ShapeSettings {
  type: ShapeType;
  size: number;
  color: string;
  restitution: number; // bounciness
  friction: number;
  density: number;
}

export interface PhysicsSettings {
  gravity: {
    x: number;
    y: number;
  };
  airFriction: number;
  wallType: 'square' | 'circle' | 'triangle' | 'custom';
}

export const Playground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [customBoundaryPoints, setCustomBoundaryPoints] = useState<{x: number, y: number}[]>([]);

  const [shapeSettings, setShapeSettings] = useState<ShapeSettings>({
    type: 'circle',
    size: 30,
    color: '#4F46E5',
    restitution: 0.8,
    friction: 0.1,
    density: 0.001,
  });

  const [physicsSettings, setPhysicsSettings] = useState<PhysicsSettings>({
    gravity: {
      x: 0,
      y: 1,
    },
    airFriction: 0.01,
    wallType: 'square',
  });

  // Initialize the physics engine
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Create engine
    const engine = Engine.create({
      gravity: {
        x: physicsSettings.gravity.x,
        y: physicsSettings.gravity.y,
      }
    });
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        wireframes: false,
        background: backgroundColor,
      }
    });

    // Create walls based on selected type
    createWalls();

    // Start the renderer
    Render.run(render);

    // Create a runner
    const runner = engineRef.current.timing;
    
    // Update the runner
    const update = () => {
      Engine.update(engine, 1000 / 60);
      requestAnimationFrame(update);
    };
    
    requestAnimationFrame(update);

    // Toast notification
    toast("Click anywhere to add shapes!");

    // Clean up on unmount
    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [backgroundColor]);

  // Update physics settings when they change
  useEffect(() => {
    if (!engineRef.current) return;

    // Update gravity
    engineRef.current.gravity.x = physicsSettings.gravity.x;
    engineRef.current.gravity.y = physicsSettings.gravity.y;

    // Clear all walls
    const allBodies = Composite.allBodies(engineRef.current.world);
    const walls = allBodies.filter(body => body.isStatic);
    walls.forEach(wall => {
      World.remove(engineRef.current!.world, wall);
    });

    // Create new walls
    createWalls();

  }, [physicsSettings, customBoundaryPoints]);

  const createCustomBoundary = () => {
    if (!engineRef.current || customBoundaryPoints.length < 3) return [];
    
    const walls = [];
    
    // Create boundary segments connecting each point
    for (let i = 0; i < customBoundaryPoints.length; i++) {
      const currentPoint = customBoundaryPoints[i];
      const nextPoint = customBoundaryPoints[(i + 1) % customBoundaryPoints.length];
      
      // Calculate midpoint, length and angle for the boundary segment
      const midX = (currentPoint.x + nextPoint.x) / 2;
      const midY = (currentPoint.y + nextPoint.y) / 2;
      const length = Math.sqrt(
        Math.pow(nextPoint.x - currentPoint.x, 2) + 
        Math.pow(nextPoint.y - currentPoint.y, 2)
      );
      const angle = Math.atan2(
        nextPoint.y - currentPoint.y,
        nextPoint.x - currentPoint.x
      );
      
      // Create a thin rectangle to serve as a wall segment
      walls.push(
        Bodies.rectangle(midX, midY, length, 10, {
          isStatic: true,
          angle: angle,
          render: { fillStyle: '#E5E7EB' }
        })
      );
    }
    
    return walls;
  };

  const createWalls = () => {
    if (!engineRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const wallThickness = 50;

    const walls = [];

    if (physicsSettings.wallType === 'custom' && customBoundaryPoints.length >= 3) {
      // Use custom boundary
      const customWalls = createCustomBoundary();
      walls.push(...customWalls);
    } else if (physicsSettings.wallType === 'square') {
      // Ground (bottom)
      walls.push(
        Bodies.rectangle(
          width / 2, 
          height + wallThickness / 2, 
          width, 
          wallThickness, 
          { isStatic: true, render: { fillStyle: '#E5E7EB' } }
        )
      );
      
      // Left wall
      walls.push(
        Bodies.rectangle(
          0 - wallThickness / 2, 
          height / 2, 
          wallThickness, 
          height, 
          { isStatic: true, render: { fillStyle: '#E5E7EB' } }
        )
      );
      
      // Right wall
      walls.push(
        Bodies.rectangle(
          width + wallThickness / 2, 
          height / 2, 
          wallThickness, 
          height, 
          { isStatic: true, render: { fillStyle: '#E5E7EB' } }
        )
      );
      
      // Ceiling (top)
      walls.push(
        Bodies.rectangle(
          width / 2, 
          0 - wallThickness / 2, 
          width, 
          wallThickness, 
          { isStatic: true, render: { fillStyle: '#E5E7EB' } }
        )
      );
    } else if (physicsSettings.wallType === 'circle') {
      // Create a circular boundary
      const radius = Math.min(width, height) / 1.8;
      const segments = 30;
      const angleIncrement = (2 * Math.PI) / segments;
      
      for (let i = 0; i < segments; i++) {
        const angle = i * angleIncrement;
        const x = width / 2 + radius * Math.cos(angle);
        const y = height / 2 + radius * Math.sin(angle);
        
        walls.push(
          Bodies.circle(x, y, 20, {
            isStatic: true,
            render: { fillStyle: '#E5E7EB' }
          })
        );
      }
    } else if (physicsSettings.wallType === 'triangle') {
      // Create triangular boundary
      const triangleHeight = height * 0.85;
      const triangleBase = width * 0.85;
      
      // Bottom side
      walls.push(
        Bodies.rectangle(
          width / 2,
          height - 10,
          triangleBase,
          20,
          { isStatic: true, render: { fillStyle: '#E5E7EB' } }
        )
      );
      
      // Left side (angled)
      const leftAngle = Math.atan2(triangleHeight, triangleBase / 2);
      const leftLength = Math.sqrt(Math.pow(triangleHeight, 2) + Math.pow(triangleBase / 2, 2));
      
      walls.push(
        Bodies.rectangle(
          width / 2 - triangleBase / 4,
          height - triangleHeight / 2,
          leftLength,
          20,
          { 
            isStatic: true, 
            angle: -leftAngle,
            render: { fillStyle: '#E5E7EB' } 
          }
        )
      );
      
      // Right side (angled)
      walls.push(
        Bodies.rectangle(
          width / 2 + triangleBase / 4,
          height - triangleHeight / 2,
          leftLength,
          20,
          { 
            isStatic: true, 
            angle: leftAngle,
            render: { fillStyle: '#E5E7EB' } 
          }
        )
      );
    }

    // Add walls to the world
    World.add(engineRef.current.world, walls);
  };

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
    
    // Update the renderer background if it exists
    if (engineRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    
    toast(`Background color changed to ${color}`);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (isDrawingMode) {
      // Add point to custom boundary
      setCustomBoundaryPoints(prev => [...prev, { x, y }]);
      return;
    }
    
    if (!engineRef.current) return;

    let shape;

    // Create the appropriate shape
    switch (shapeSettings.type) {
      case 'circle':
        shape = Bodies.circle(x, y, shapeSettings.size, {
          restitution: shapeSettings.restitution,
          friction: shapeSettings.friction,
          density: shapeSettings.density,
          render: {
            fillStyle: shapeSettings.color,
          }
        });
        break;
      case 'square':
        shape = Bodies.rectangle(x, y, shapeSettings.size * 2, shapeSettings.size * 2, {
          restitution: shapeSettings.restitution,
          friction: shapeSettings.friction,
          density: shapeSettings.density,
          render: {
            fillStyle: shapeSettings.color,
          }
        });
        break;
      case 'triangle':
        shape = Bodies.polygon(x, y, 3, shapeSettings.size, {
          restitution: shapeSettings.restitution,
          friction: shapeSettings.friction,
          density: shapeSettings.density,
          render: {
            fillStyle: shapeSettings.color,
          }
        });
        break;
      case 'pentagon':
        shape = Bodies.polygon(x, y, 5, shapeSettings.size, {
          restitution: shapeSettings.restitution,
          friction: shapeSettings.friction,
          density: shapeSettings.density,
          render: {
            fillStyle: shapeSettings.color,
          }
        });
        break;
      case 'hexagon':
        shape = Bodies.polygon(x, y, 6, shapeSettings.size, {
          restitution: shapeSettings.restitution,
          friction: shapeSettings.friction,
          density: shapeSettings.density,
          render: {
            fillStyle: shapeSettings.color,
          }
        });
        break;
      default:
        shape = Bodies.circle(x, y, shapeSettings.size, {
          restitution: shapeSettings.restitution,
          friction: shapeSettings.friction,
          density: shapeSettings.density,
          render: {
            fillStyle: shapeSettings.color,
          }
        });
    }

    World.add(engineRef.current.world, [shape]);
  };

  const handleClearShapes = () => {
    if (!engineRef.current) return;

    // Get all bodies
    const allBodies = Composite.allBodies(engineRef.current.world);
    
    // Filter out static bodies (walls)
    const nonStaticBodies = allBodies.filter(body => !body.isStatic);
    
    // Remove all non-static bodies
    nonStaticBodies.forEach(body => {
      World.remove(engineRef.current!.world, body);
    });

    toast("All shapes cleared!");
  };
  
  const toggleDrawingMode = () => {
    if (isDrawingMode) {
      // Finish drawing mode
      if (customBoundaryPoints.length >= 3) {
        setPhysicsSettings({
          ...physicsSettings,
          wallType: 'custom'
        });
        toast("Custom boundary created!");
      } else {
        toast.error("Need at least 3 points for a boundary!");
      }
    } else {
      // Start drawing mode
      setCustomBoundaryPoints([]);
      toast("Draw mode enabled! Click to place boundary points.");
    }
    setIsDrawingMode(!isDrawingMode);
  };
  
  const clearCustomBoundary = () => {
    setCustomBoundaryPoints([]);
    if (physicsSettings.wallType === 'custom') {
      setPhysicsSettings({
        ...physicsSettings,
        wallType: 'square'
      });
    }
    toast("Custom boundary cleared!");
  };

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas 
        ref={canvasRef} 
        onClick={handleCanvasClick} 
        className="w-full h-full absolute inset-0 z-0"
      />
      <BoundaryDrawer 
        isDrawing={isDrawingMode}
        points={customBoundaryPoints}
        onToggleDrawing={toggleDrawingMode}
        onClearBoundary={clearCustomBoundary}
      />
      <BackgroundColorPicker 
        currentColor={backgroundColor}
        onColorChange={handleBackgroundColorChange}
      />
      <ControlPanel 
        shapeSettings={shapeSettings}
        setShapeSettings={setShapeSettings}
        physicsSettings={physicsSettings}
        setPhysicsSettings={setPhysicsSettings}
        onClearShapes={handleClearShapes}
      />
    </div>
  );
};
