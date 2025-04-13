
import React, { useState } from 'react';
import { ShapeSettings, PhysicsSettings, ShapeType } from './Playground';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Circle,
  Square,
  Triangle,
  Pentagon,
  Hexagon,
  Maximize2,
  Minimize2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  shapeSettings: ShapeSettings;
  setShapeSettings: React.Dispatch<React.SetStateAction<ShapeSettings>>;
  physicsSettings: PhysicsSettings;
  setPhysicsSettings: React.Dispatch<React.SetStateAction<PhysicsSettings>>;
  onClearShapes: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  shapeSettings,
  setShapeSettings,
  physicsSettings,
  setPhysicsSettings,
  onClearShapes,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleShapeTypeChange = (type: ShapeType) => {
    setShapeSettings({ ...shapeSettings, type });
  };

  const handleWallTypeChange = (wallType: 'square' | 'circle' | 'triangle') => {
    setPhysicsSettings({ ...physicsSettings, wallType });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShapeSettings({ ...shapeSettings, color: e.target.value });
  };

  const handleSizeChange = (value: number[]) => {
    setShapeSettings({ ...shapeSettings, size: value[0] });
  };

  const handleRestitutionChange = (value: number[]) => {
    setShapeSettings({ ...shapeSettings, restitution: value[0] });
  };

  const handleFrictionChange = (value: number[]) => {
    setShapeSettings({ ...shapeSettings, friction: value[0] });
  };

  const handleDensityChange = (value: number[]) => {
    setShapeSettings({ ...shapeSettings, density: value[0] / 1000 });
  };

  const handleGravityChange = (axis: 'x' | 'y', value: number) => {
    setPhysicsSettings({
      ...physicsSettings,
      gravity: {
        ...physicsSettings.gravity,
        [axis]: value,
      },
    });
  };

  const resetPhysics = () => {
    setPhysicsSettings({
      gravity: { x: 0, y: 1 },
      airFriction: 0.01,
      wallType: 'square',
    });
  };

  return (
    <div
      className={cn(
        "fixed z-10 right-0 top-0 h-full bg-white shadow-lg transition-all duration-300 flex",
        isCollapsed ? "w-12" : "w-80"
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-white rounded-l-lg p-2 shadow"
      >
        {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {isCollapsed ? (
        <div className="flex flex-col items-center justify-center w-full">
          <Button
            variant="ghost"
            size="icon"
            className="mb-4"
            onClick={() => setIsCollapsed(false)}
          >
            <ChevronLeft size={20} />
          </Button>
        </div>
      ) : (
        <div className="w-full p-4 overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>

          <Tabs defaultValue="shapes">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="shapes" className="flex-1">Shapes</TabsTrigger>
              <TabsTrigger value="physics" className="flex-1">Physics</TabsTrigger>
            </TabsList>

            <TabsContent value="shapes" className="space-y-4">
              <div className="space-y-2">
                <Label>Shape Type</Label>
                <div className="grid grid-cols-5 gap-2">
                  <Button
                    variant={shapeSettings.type === 'circle' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handleShapeTypeChange('circle')}
                  >
                    <Circle size={20} />
                  </Button>
                  <Button
                    variant={shapeSettings.type === 'square' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handleShapeTypeChange('square')}
                  >
                    <Square size={20} />
                  </Button>
                  <Button
                    variant={shapeSettings.type === 'triangle' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handleShapeTypeChange('triangle')}
                  >
                    <Triangle size={20} />
                  </Button>
                  <Button
                    variant={shapeSettings.type === 'pentagon' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handleShapeTypeChange('pentagon')}
                  >
                    <Pentagon size={20} />
                  </Button>
                  <Button
                    variant={shapeSettings.type === 'hexagon' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handleShapeTypeChange('hexagon')}
                  >
                    <Hexagon size={20} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: shapeSettings.color }}
                  />
                  <input
                    type="color"
                    value={shapeSettings.color}
                    onChange={handleColorChange}
                    className="w-full h-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Size</Label>
                  <span className="text-sm text-gray-500">{shapeSettings.size}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <Minimize2 size={16} />
                  <Slider
                    value={[shapeSettings.size]}
                    min={10}
                    max={100}
                    step={1}
                    onValueChange={handleSizeChange}
                  />
                  <Maximize2 size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Bounciness</Label>
                  <span className="text-sm text-gray-500">{shapeSettings.restitution.toFixed(2)}</span>
                </div>
                <Slider
                  value={[shapeSettings.restitution]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleRestitutionChange}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Friction</Label>
                  <span className="text-sm text-gray-500">{shapeSettings.friction.toFixed(2)}</span>
                </div>
                <Slider
                  value={[shapeSettings.friction]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleFrictionChange}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Mass</Label>
                  <span className="text-sm text-gray-500">{(shapeSettings.density * 1000).toFixed(0)}</span>
                </div>
                <Slider
                  value={[shapeSettings.density * 1000]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={handleDensityChange}
                />
              </div>
            </TabsContent>

            <TabsContent value="physics" className="space-y-4">
              <div className="space-y-2">
                <Label>Boundary Shape</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={physicsSettings.wallType === 'square' ? 'default' : 'outline'}
                    onClick={() => handleWallTypeChange('square')}
                  >
                    <Square size={16} className="mr-2" />
                    Square
                  </Button>
                  <Button
                    variant={physicsSettings.wallType === 'circle' ? 'default' : 'outline'}
                    onClick={() => handleWallTypeChange('circle')}
                  >
                    <Circle size={16} className="mr-2" />
                    Circle
                  </Button>
                  <Button
                    variant={physicsSettings.wallType === 'triangle' ? 'default' : 'outline'}
                    onClick={() => handleWallTypeChange('triangle')}
                  >
                    <Triangle size={16} className="mr-2" />
                    Triangle
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Gravity Direction</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-start-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGravityChange('y', -1)}
                      className={cn(
                        physicsSettings.gravity.y === -1 && "bg-primary text-primary-foreground"
                      )}
                    >
                      <ArrowUp size={20} />
                    </Button>
                  </div>
                  <div className="col-start-1 row-start-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGravityChange('x', -1)}
                      className={cn(
                        physicsSettings.gravity.x === -1 && "bg-primary text-primary-foreground"
                      )}
                    >
                      <ArrowLeft size={20} />
                    </Button>
                  </div>
                  <div className="col-start-2 row-start-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={resetPhysics}
                    >
                      <RefreshCw size={20} />
                    </Button>
                  </div>
                  <div className="col-start-3 row-start-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGravityChange('x', 1)}
                      className={cn(
                        physicsSettings.gravity.x === 1 && "bg-primary text-primary-foreground"
                      )}
                    >
                      <ArrowRight size={20} />
                    </Button>
                  </div>
                  <div className="col-start-2 row-start-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGravityChange('y', 1)}
                      className={cn(
                        physicsSettings.gravity.y === 1 && "bg-primary text-primary-foreground"
                      )}
                    >
                      <ArrowDown size={20} />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>No Gravity (Zero-G)</Label>
                <Button
                  variant={physicsSettings.gravity.x === 0 && physicsSettings.gravity.y === 0 ? "default" : "outline"}
                  onClick={() => setPhysicsSettings({
                    ...physicsSettings,
                    gravity: { x: 0, y: 0 }
                  })}
                  className="w-full"
                >
                  Toggle Zero Gravity
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={onClearShapes}
            >
              <Trash2 size={16} className="mr-2" />
              Clear All Shapes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
