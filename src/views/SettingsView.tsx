import { usePluginManifest } from '@/hooks/usePluginManifest';

export const SettingsView: React.FC = () => {
  const manifest = usePluginManifest();

  if (!manifest) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dream-journal-settings">
      <div className="dream-journal-settings-footer">
        <p>By <a href="https://bsky.app/profile/evanharris.bsky.social" target="_blank" rel="noopener noreferrer">Evan Harris</a></p>
        <p>Version: v{manifest.version}</p>
      </div>
    </div>
  );
};