import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import * as THREE from 'three';
import { useAscentStore, Milestone } from '../stores/useAscentStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

const MilestoneBlock = ({ milestone, position, color }) => {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (ref.current) {
      ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, hovered ? 1.2 : 1, 0.1);
    }
  });

  return (
    <group position={position}>
      <Box
        ref={ref}
        args={[1, 0.5, 0.5]} // width, height, depth
        onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
        onPointerOut={() => setHover(false)}
      >
        <meshStandardMaterial color={hovered ? '#a78bfa' : color} />
      </Box>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
        visible={hovered}
      >
        {milestone.title}
      </Text>
    </group>
  );
};

const Scene = ({ ascentId }) => {
  const { milestones, loadMilestones } = useAscentStore();
  const [tasks, setTasks] = useState<Milestone[]>([]);

  useEffect(() => {
    if (ascentId) {
      loadMilestones(ascentId);
    }
  }, [ascentId, loadMilestones]);

  useEffect(() => {
    const ascentMilestones = milestones[ascentId] || [];
    if (ascentMilestones.length > 0) {
      setTasks(ascentMilestones.sort((a, b) => a.sequence_order - b.sequence_order));
    }
  }, [ascentId, milestones]);

  const milestoneBlocks = useMemo(() => {
    const colors = ['#818cf8', '#60a5fa', '#38bdf8', '#22d3ee', '#2dd4bf', '#34d399'];
    return tasks.map((milestone, index) => (
      <MilestoneBlock
        key={milestone.id}
        milestone={milestone}
        position={[index * 1.5, 0, 0]} // Position blocks along the x-axis
        color={colors[index % colors.length]}
      />
    ));
  }, [tasks]);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OrbitControls />
      <gridHelper args={[100, 100]} rotation-x={Math.PI / 2} position={[0, -0.5, 0]} />
      {milestoneBlocks}
    </>
  );
};

const AscentDetail3D = () => {
  const { ascentId } = useParams<{ ascentId: string }>();
  const { loading } = useAscentStore();

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900">
      <div className="absolute top-4 left-4 z-10">
        <Button asChild variant="ghost" className="text-white hover:bg-gray-700 hover:text-white">
          <Link to={`/app/ascent/${ascentId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to 2D View
          </Link>
        </Button>
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-20">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
      )}
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <Scene ascentId={ascentId} />
      </Canvas>
    </div>
  );
};

export default AscentDetail3D;
