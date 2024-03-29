import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { useNavigation } from "@react-navigation/native";
import _ from "lodash";

const WrongTestPage = () => {
  const navigation = useNavigation();
  const [totalWrongCount, setTotalWrongCount] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [wrongVocab, setWrongVocab] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  const loadWrongVocab = async () => {
    try {
      const storedWrongVocab = await AsyncStorage.getItem("wrongVocab");
      if (storedWrongVocab !== null) {
        const filteredWrongVocab = JSON.parse(storedWrongVocab).filter(
          (word) => word.wrongcount > 0
        );
        setWrongVocab(filteredWrongVocab);
      }
    } catch (error) {
      console.error("오답 목록을 불러오는 데 실패했습니다.", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setCurrentNumber(0);
      setUserAnswers([]);
      loadWrongVocab();
    }, [])
  );
  const handleAnswer = async (selectedWord, option) => {
    const correctAnswer = selectedWord.answer[0];
    const newUserAnswers = [
      ...userAnswers,
      { word: selectedWord.word, selected: option },
    ];

    setUserAnswers(newUserAnswers);
    if (option !== selectedWord.answer[0]) {
      // 틀린 경우
      setTotalWrongCount(totalWrongCount + 1);
    }

    if (option === correctAnswer) {
      // 정답인 경우
      const newWrongVocab = wrongVocab.map((word) =>
        word.word === selectedWord.word
          ? {
              ...word,
              wrongcount: word.wrongcount > 0 ? word.wrongcount - 1 : 0,
            } // wrongcount 감소
          : word
      );
      setWrongVocab(newWrongVocab);
      await AsyncStorage.setItem("wrongVocab", JSON.stringify(newWrongVocab));
    } else {
      // 틀린 경우
      const newWrongVocab = wrongVocab.map((word) =>
        word.word === selectedWord.word
          ? { ...word, wrongcount: word.wrongcount + 1 }
          : word
      );
      setWrongVocab(newWrongVocab);
      await AsyncStorage.setItem("wrongVocab", JSON.stringify(newWrongVocab));
    }

    // 다음 문제로 이동
    if (currentNumber < wrongVocab.length - 1) {
      setCurrentNumber(currentNumber + 1);
    } else {
      await updateTotalWrongCount();

      navigation.navigate("WrongTestAnswerPage", {
        userAnswers: newUserAnswers, // 사용자가 푼 답변 데이터 전달
        selectedWords: wrongVocab, // 선택된 단어 목록 전달
      });
    }
  };
  const updateTotalWrongCount = async () => {
    try {
      await AsyncStorage.setItem(
        "totalWrongCount",
        JSON.stringify(totalWrongCount)
      );
    } catch (error) {
      console.error("총 틀린 횟수 저장 중 오류 발생:", error);
    }
  };
  // 이전 및 다음 버튼 핸들러 (todaytestpage.js에서 가져옴)

  const goToPrevious = () => {
    if (currentNumber > 0) {
      setCurrentNumber(currentNumber - 1);
    }
  };

  const goToNext = () => {
    if (currentNumber < wrongVocab.length - 1) {
      setCurrentNumber(currentNumber + 1);
    }
  };

  // UI 구성 (todaytestpage.js에서 가져옴, 필요에 따라 수정)
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* currentNumber가 범위 내에 있는지 확인 */}
        {wrongVocab[currentNumber] && (
          <Text style={styles.wordText}>{wrongVocab[currentNumber].word}</Text>
        )}
      </View>
      <View style={styles.navigation}>
        <TouchableOpacity>
          <Text style={styles.navButtonText} onPress={goToPrevious}>
            {"<"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.navText}>
          {currentNumber + 1}/{wrongVocab.length}
        </Text>
        <TouchableOpacity>
          <Text style={styles.navButtonText} onPress={goToNext}>
            {">"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* currentNumber가 범위 내에 있는지 확인 */}
      {wrongVocab[currentNumber] &&
        wrongVocab[currentNumber].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => handleAnswer(wrongVocab[currentNumber], option)}
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
    paddingTop: 50,
    backgroundColor: "white",
  },
  card: {
    width: "75%",
    height: "20%",
    marginVertical: 2,
    padding: 20,
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
    justifyContent: "center",
    width: "75%", // 버튼의 너비
    height: "15%",
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
// styles (todaytestpage.js에서 가져옴, 필요에 따라 수정)

export default WrongTestPage;
