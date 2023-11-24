import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import words from "../vocab/todayvocab";
import wrongVocab from "../vocab/wrongvocab";
import _ from "lodash"; // lodash 라이브러리 임포트

const TodayTestPage = () => {
  const navigation = useNavigation();
  const [currentNumber, setCurrentNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [wrongVocab, setWrongVocab] = useState([]); // 오답 단어 배열

  useEffect(() => {
    const shuffledWords = _.shuffle(words);
    const selected = shuffledWords.slice(0, 10);
    setSelectedWords(selected);
  }, []);

  const handleAnswer = (option) => {
    const selectedWord = selectedWords[currentNumber];
    const correctAnswer = selectedWord.answer;

    const newUserAnswers = [
      ...userAnswers,
      { word: selectedWord.word, selected: option },
    ];

    setUserAnswers(newUserAnswers);

    if (currentNumber < selectedWords.length - 1) {
      setCurrentNumber(currentNumber + 1);
    } else {
      navigation.navigate("TodayTestAnswer", {
        userAnswers: newUserAnswers,
        selectedWords: selectedWords,
      });
    }

    // 사용자가 틀린 경우 오답 단어를 추가
    if (option !== correctAnswer) {
      setWrongVocab([...wrongVocab, selectedWord]);
    }
  };
  const goToPrevious = () => {
    if (currentNumber > 0) {
      setCurrentNumber(currentNumber - 1);
    }
  };

  const goToNext = () => {
    if (currentNumber < selectedWords.length - 1) {
      setCurrentNumber(currentNumber + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* currentNumber가 범위 내에 있는지 확인 */}
        {selectedWords[currentNumber] && (
          <Text style={styles.wordText}>
            {selectedWords[currentNumber].word}
          </Text>
        )}
      </View>
      <View style={styles.navigation}>
        <TouchableOpacity>
          <Text style={styles.navButtonText} onPress={goToPrevious}>
            {"<"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.navText}>
          {currentNumber + 1}/{selectedWords.length}
        </Text>
        <TouchableOpacity>
          <Text style={styles.navButtonText} onPress={goToNext}>
            {">"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* currentNumber가 범위 내에 있는지 확인 */}
      {selectedWords[currentNumber] &&
        selectedWords[currentNumber].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  card: {
    width: "75%",
    height: "20%",
    marginVertical: 2,
    padding: 20,
    marginTop: 150,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#A4A4A4",
    borderRadius: 30,
  },
  wordText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "40%",
    marginVertical: 20,
  },
  navButton: {
    padding: 20,
  },
  navText: {
    fontSize: 18,
    marginHorizontal: 20,
  },
  button: {
    marginBottom: 40, // 버튼 사이의 간격
    backgroundColor: "#AABCFD", // 버튼의 배경색
    borderRadius: 20, // 버튼의 모서리 둥글기
    paddingVertical: 30, // 상하 패딩
    width: "75%", // 버튼의 너비
    elevation: 3, // 안드로이드에서 그림자 효과
    shadowOpacity: 0.3, // iOS에서 그림자 효과
    shadowRadius: 4, // iOS에서 그림자 둥근 효과
    shadowColor: "#000", // iOS에서 그림자 색상
    shadowOffset: { height: 2, width: 0 }, // iOS에서 그림자 방향
    borderColor: "#A4A4A4",
    borderWidth: 1,
  },
  buttonText: {
    color: "black", // 텍스트 색상
    textAlign: "center", // 텍스트 정렬
    fontSize: 30, // 텍스트 크기
    fontWeight: "bold", // 텍스트 굵기
  },
  navButtonText: {
    fontSize: 30,
    color: "black",
  },
});

export default TodayTestPage;
