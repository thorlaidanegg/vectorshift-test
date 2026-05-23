import { Toolbar }        from './components/toolbar/Toolbar';
import { PipelineCanvas } from './components/canvas/PipelineCanvas';
import { SubmitButton }   from './components/ui/SubmitButton';

function App() {
  return (
    <div className="app">
      <Toolbar />
      <PipelineCanvas />
      <SubmitButton />
    </div>
  );
}

export default App;
