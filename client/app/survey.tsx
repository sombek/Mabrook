import * as React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabase';
import { Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '~/lib/useColorScheme';
import { Icon } from '@roninoss/icons';
import { Toggle } from '~/components/nativewindui/Toggle';
import { DatePicker } from '~/components/nativewindui/DatePicker';
import { Button } from '~/components/nativewindui/Button';
import { AppType } from '../../server/src';
import { hc } from 'hono/dist/client';

const RenderSurvey = ({
  survey,
  setAnswers,
  currentQuestion,
}: {
  survey: any;
  setAnswers: any;
  currentQuestion: number;
}) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [booleanValue, setBooleanValue] = useState(false);

  useEffect(() => {
    // Update the answer whenever any value changes
    switch (survey.questionType) {
      case 'number':
        setAnswers((prev: any) => {
          const newAnswers = [...prev];
          newAnswers[currentQuestion] = '';
          return newAnswers;
        });
        break;
      case 'multipleChoice':
        setAnswers((prev: any) => {
          const newAnswers = [...prev];
          newAnswers[currentQuestion] = selectedOption;
          return newAnswers;
        });
        break;
      case 'date':
        setAnswers((prev: any) => {
          const newAnswers = [...prev];
          newAnswers[currentQuestion] = selectedDate;
          return newAnswers;
        });
        break;
      case 'boolean':
        setAnswers((prev: any) => {
          const newAnswers = [...prev];
          newAnswers[currentQuestion] = booleanValue;
          return newAnswers;
        });
        break;
      default:
        throw new Error('Invalid question type');
    }
  }, [selectedOption, selectedDate, booleanValue]);

  switch (survey.questionType) {
    case 'number':
      return (
        <>
          <Text>{survey.questionText}</Text>
          <View className="w-full flex-row items-center justify-center px-10">
            <TextInput
              keyboardType="phone-pad"
              className="h-14 w-full rounded-xl border-gray-300  bg-white px-2 text-gray-700"
              onChangeText={(text) =>
                setAnswers((prev: any) => {
                  const newAnswers = [...prev];
                  newAnswers[currentQuestion] = text;
                  return newAnswers;
                })
              }
            />
          </View>
        </>
      );
    case 'multipleChoice':
      return (
        <View>
          <Text>{survey.questionText}</Text>
          {survey.options.map((option: string) => (
            // selectable radio buttons
            <View className="flex-row items-center justify-start gap-4">
              <Pressable
                onPress={() => setSelectedOption(option)}
                className="flex-row items-center justify-start gap-4">
                <Icon
                  name={selectedOption === option ? 'check-circle' : 'circle-outline'}
                  size={24}
                />
                <Text>{option}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      );
    case 'date':
      return (
        <>
          <Text>{survey.questionText}</Text>
          <DatePicker
            mode={'date'}
            minimumDate={new Date()}
            value={new Date()}
            onChange={(event, selectedDate) => {
              if (selectedDate) setSelectedDate(selectedDate);
            }}
          />
        </>
      );
    case 'boolean':
      return (
        <View className="flex-row items-center justify-start gap-4">
          <Toggle value={booleanValue} onValueChange={setBooleanValue} />
          <Text>{survey.questionText}</Text>
        </View>
      );
    default:
      throw new Error('Invalid question type');
  }
};

const SurveyQuestions = ({ survey }: { survey: any }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any>(Array(survey.questions.length).fill(''));

  const handleNext = () => {
    if (currentQuestion === survey.questions.length - 1) {
      return;
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrevious = () => {
    if (currentQuestion === 0) {
      return;
    }
    setCurrentQuestion(currentQuestion - 1);
  };

  const handleSubmit = async () => {
    try {
      console.log('Submitting answers:', answers);
      const answersWithQuestions = [];
      // print questions and answers to console
      for (let i = 0; i < survey.questions.length; i++) {
        answersWithQuestions.push({
          question: survey.questions[i].questionText,
          answer: '' + answers[i],
        });
      }
      console.log(answersWithQuestions);
      const session = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }
      console.log(session.data.session?.access_token);
      const client = hc<AppType>('http://localhost:8787/', {
        headers: {
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
      });
      const response = await client.tasks.$post({
        json: answersWithQuestions,
      });
      const data = await response.json();
      console.log(data);
      console.log(response);

      // const { error } = await supabase.from('responses').insert([{ answers }]);
      // if (error) throw error;
      console.log('Answers submitted successfully');
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  return (
    <View className="min-h-96 flex-col items-center justify-center gap-4">
      <View className="min-h-96 flex-col items-center justify-center gap-4">
        <RenderSurvey
          survey={survey.questions[currentQuestion]}
          setAnswers={setAnswers}
          currentQuestion={currentQuestion}
        />
      </View>
      <View className="w-full flex-row items-center justify-between gap-4">
        {currentQuestion > 0 && (
          <Button onPress={handlePrevious} variant={'secondary'}>
            <Text>السابق</Text>
          </Button>
        )}
        {currentQuestion < survey.questions.length - 1 && (
          <Button onPress={handleNext} className="">
            <Text>التالي</Text>
          </Button>
        )}
        {currentQuestion === survey.questions.length - 1 && (
          <Button onPress={handleSubmit} className="">
            <Text>إرسال</Text>
          </Button>
        )}
      </View>
      <Text className="mt-4 text-center text-base text-gray-800">
        {currentQuestion + 1} / {survey.questions.length}
      </Text>
    </View>
  );
};

const Survey = () => {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [survey, setSurvey] = useState(null);
  useEffect(() => {
    // get first record from survey table in supabase
    const fetchSurvey = async () => {
      const { data, error } = await supabase.from('survey').select('*').limit(1);
      if (data) setSurvey(data[0].survey);
    };
    fetchSurvey().then();
  }, []);

  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <View className="h-32 flex-row items-end justify-between bg-amber-500 p-4 shadow-md">
        <Text className="text-center text-2xl font-bold text-white">استبيان الزفاف</Text>
      </View>
      <ScrollView>
        <View className="mt-4 flex-1 items-center justify-center gap-1 px-12">
          {survey ? <SurveyQuestions survey={survey} /> : <Text>Loading...</Text>}
        </View>
      </ScrollView>
    </>
  );
};

export default Survey;
