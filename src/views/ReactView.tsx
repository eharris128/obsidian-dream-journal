import { useApp } from '../hooks/useApp';
import { Dream } from '../components/Dream';

export const ReactView = () => {
    const app = useApp();

    if (!app) {
        return <div>Loading...</div>;
    }
    const { vault } = app;
  
    return (
    <div>
        <h4>{vault.getName()}</h4>
        <Dream />
    </div>
    );
  };