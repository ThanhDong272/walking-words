import uuid from "react-native-uuid";

export const transformData = (inputArray: string[][]) => {
  return inputArray.map((group, groupIndex) => {
    const groupUuid = uuid.v4();
    let combinedContent = "";

    const transformedContent = group.map((item) => {
      const uuidMatch = item.match(/data-uuid="([^"]*)"/);
      const pageUuidMatch = item.match(/data-page-uuid="([^"]*)"/);

      const _uuid = uuidMatch ? uuidMatch[1] : uuid.v4();
      const pageUuid = pageUuidMatch ? pageUuidMatch[1] : null;

      combinedContent += item;

      return {
        uuid: _uuid,
        pageUUID: pageUuid,
        content: item.replace(/ data-(uuid|page-uuid)="[^"]*"/g, ""),
      };
    });

    return {
      uuid: groupUuid,
      number: groupIndex + 1,
      startTime: groupIndex * 50,
      endTime: (groupIndex + 1) * 50,
      content: transformedContent,
      showLine: true,
      fullContent: combinedContent,
    };
  });
};
