import {useState} from 'react'; 
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableHighlight
} from 'react-native';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 

export default function App() {
  const [word, setWord] = useState<string>('');
  const [displayWord, setDisplayWord] = useState<string>('');
  const [usedLetters, setUsedLetters] = useState<string[]>([]); 
  const [remainingGuesses, setRemainingGuesses] = useState<number>(6);

  const fetchRandomWord = async () => {
    try {
      const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
      const data = await response.json();
      setWord(data[0].toUpperCase());
      setDisplayWord('_ '.repeat(data[0].length)); 
      setUsedLetters([]); 
      setRemainingGuesses(6);
    } catch (error)
    {
        console.error('Error fetching work: ', error); 
    }
  };

  const renderAlphabetButtons = () => {
    return [...ALPHABET].map((letter) => (
      <TouchableHighlight
        key = {letter}
        onPress= {() => handleLetterPress(letter)}
        disabled = {usedLetters.includes(letter) || remainingGuesses <= 0}
      >
        <Text>{letter}</Text>
      </TouchableHighlight>
    ));
  };

  const handleLetterPress = (letter: string) => {
    if (usedLetters.includes(letter) || remainingGuesses <= 0 )  
      return; 

    setUsedLetters([...usedLetters,letter]); 

    if (word.includes(letter)){
      // update the displayed word
      const updatedDisplay = word.split('').map((char, index)=> 
        usedLetters.includes(char) || char === letter ? char : '_ '
      ).join(''); 
      setDisplayWord(updatedDisplay);
    } else {
      // decrease the remaining guesses if the letter is incorrect 
      setRemainingGuesses(remainingGuesses - 1); 
    }
  };

  return (
    <View style={styles.container}>
      <Text>{displayWord || 'Press "Start Game" to begin'}</Text>
      <Text>Remaining Guesses: {remainingGuesses}</Text>
      <TouchableHighlight onPress={fetchRandomWord}>
        <Text>Start Game</Text>
      </TouchableHighlight>
      <View>
        {renderAlphabetButtons()}
      </View>
      {remainingGuesses === 0 && <Text>Game over - The word was "{word}"</Text>}
      {displayWord === word && <Text>Congratulations - You won</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
