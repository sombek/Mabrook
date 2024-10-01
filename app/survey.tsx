import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabase';
import { Platform, ScrollView, TextInput, View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useColorScheme } from '~/lib/useColorScheme';
import { ThemeToggle } from '~/components/ThemeToggle';
import { Icon } from '@roninoss/icons';

const RenderSurvey = ({ survey }: { survey: any }) => {
  switch (survey.questionType) {
    case 'number':
      return (
        <>
          <Text>{survey.questionText}</Text>
          <View className="w-full flex-row items-center justify-center px-10">
            <TextInput className="h-14 w-full rounded-xl rounded-l-none border  border-l-0 border-gray-300  bg-white px-2 text-gray-700" />
          </View>
        </>
      );

    case 'multipleChoice':
      return (
        <View>
          <Text>{survey.questionText}</Text>
          {survey.options.map((option: string) => (
            <Text key={option}>{option}</Text>
          ))}
        </View>
      );
    case 'date':
      return <Text>{survey.questionText}</Text>;
    case 'boolean':
      return <Text>{survey.questionText}</Text>;
    default:
      return <Text>{survey.questionText}</Text>;
  }
};

const Survey = () => {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [survey, setSurvey] = useState(null);
  useEffect(() => {
    // get first record from survey table in supabase
    const fetchSurvey = async () => {
      const { data, error } = await supabase.from('survey').select('*').limit(1);
      setSurvey(data[0].survey);
    };
    fetchSurvey().then();
  }, []);
  // {
  //   "questions": [
  //     {
  //       "questionId": 1,
  //       "questionText": "كم عدد الضيوف المتوقع حضورهم؟",
  //       "questionType": "number"
  //     },
  //     {
  //       "questionId": 2,
  //       "questionText": "هل الحفل سيكون للرجال فقط، للنساء فقط، أم حفل مختلط؟",
  //       "questionType": "multipleChoice",
  //       "options": ["رجال فقط", "نساء فقط", "حفل مختلط"]
  //     },
  //     {
  //       "questionId": 3,
  //       "questionText": "ما هو التاريخ المبدئي لحفل الزفاف؟",
  //       "questionType": "date"
  //     },
  //     {
  //       "questionId": 4,
  //       "questionText": "هل تفضلون إقامة الحفل في قاعة أفراح أم في مكان مفتوح؟",
  //       "questionType": "multipleChoice",
  //       "options": ["قاعة أفراح", "مكان مفتوح"]
  //     },
  //     {
  //       "questionId": 5,
  //       "questionText": "هل ترغبون في إقامة الحفل في المدينة أو خارجها؟",
  //       "questionType": "multipleChoice",
  //       "options": ["داخل المدينة", "خارج المدينة"]
  //     },
  //     {
  //       "questionId": 6,
  //       "questionText": "هل تفضلون توفير بوفيه مفتوح أم قائمة طعام محددة؟",
  //       "questionType": "multipleChoice",
  //       "options": ["بوفيه مفتوح", "قائمة طعام محددة"]
  //     },
  //     {
  //       "questionId": 7,
  //       "questionText": "ما نوع الترفيه الذي ترغبون في توفيره للحفل؟",
  //       "questionType": "multipleChoice",
  //       "options": ["فرقة موسيقية", "منشد", "بدون ترفيه"]
  //     },
  //     {
  //       "questionId": 8,
  //       "questionText": "هل ترغبون في توفير خدمات تصوير احترافي؟",
  //       "questionType": "boolean"
  //     },
  //     {
  //       "questionId": 9,
  //       "questionText": "ما هي الميزانية المبدئية للحفل؟",
  //       "questionType": "number"
  //     },
  //     {
  //       "questionId": 10,
  //       "questionText": "هل تفضلون استئجار سيارات فخمة لنقل العروس والعريس؟",
  //       "questionType": "boolean"
  //     }
  //   ]
  // }
  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <View className="h-32 flex-row items-end justify-between bg-white p-4 shadow-md">
        <Text className="text-right text-2xl font-bold text-gray-800">استبيان الزفاف</Text>
      </View>
      <ScrollView>
        <View className="mt-4 flex-1 items-center justify-center gap-1 px-12">
          {survey ? (
            survey.questions.map((question: any) => (
              <RenderSurvey key={question.questionId} survey={question} />
            ))
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default Survey;
