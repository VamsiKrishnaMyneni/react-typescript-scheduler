import './App.css';
import Schedular from './schedular';

function App() {
  return (
    <div className="App">
      <Schedular
        events={[]}
        onCellClick={() => { }}
        onTaskClick={() => { }}
        onEventsChange={() => { }}
        onAlertCloseButtonClicked={() => { }}
      />
    </div>
  );
}

export default App;
