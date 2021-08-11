import useKeepSWRDataLiveAsBlocksArrive from "hooks/useKeepSWRDataLiveAsBlocksArrive"
import { useMemo } from "react"
import useSWR from "swr"
import { Level } from "temporaryData/types"

type MemberCountResponse = {
  id: number
  membersCount: number
}

type MemberCount = {
  sum?: number
  [levelId: string]: number
}

const getMemberCount = (_: string, id: number): Promise<MemberCountResponse[]> =>
  fetch(`https://api.agora.space/community/getMemberCount/${id}`).then((response) =>
    response.ok
      ? response.json()
      : Promise.reject(new Error(`Unable to fetch member count of community ${id}`))
  )

const useMemberCount = (communityId: number, initialLevels: Level[]) => {
  // the mocked communities from tokens.json have negative ids
  const shouldFetch = communityId >= 0

  const { data, mutate } = useSWR(
    shouldFetch ? ["membercount", communityId] : null,
    getMemberCount,
    {
      initialData: initialLevels.map(({ id, membersCount }) => ({
        id,
        membersCount,
      })),
    }
  )

  const memberCountData = useMemo(() => {
    const levelsData: MemberCount = {}
    data.forEach(({ id, membersCount }) => {
      levelsData[id] = membersCount
      levelsData.sum = (levelsData.sum ?? 0) + membersCount
    })
    return levelsData
  }, [data])

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return memberCountData
}

export default useMemberCount
