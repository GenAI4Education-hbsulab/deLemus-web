import dynamic from 'next/dynamic';

const AvatarSceneContent = dynamic(() => import('./avatarSceneContent'), {
  ssr: false,
});

const AvatarScene: React.FC = () => {
  return <AvatarSceneContent />;
};

export default AvatarScene;