import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/[community]/common/Context"
import { useEffect } from "react"
import { Machine } from "temporaryData/types"
import { MetaMaskError } from "utils/processMetaMaskError"
import { assign, createMachine, DoneInvokeEvent } from "xstate"
import usePersonalSign from "./usePersonalSign"

type Invite = {
  inviteLink: string
  alreadyJoined?: boolean
}

const initialInviteData: Invite = { inviteLink: "", alreadyJoined: false }

type JoinError = MetaMaskError | Response | Error

type Context = {
  error?: JoinError
  inviteData?: Invite
  id: string
}

type ErrorEvent = DoneInvokeEvent<JoinError>
type InviteEvent = DoneInvokeEvent<Invite>
type Event = ErrorEvent | InviteEvent

const joinModalMachine = createMachine<Context, Event>(
  {
    initial: "disabled",
    context: {
      error: undefined,
      inviteData: initialInviteData,
      id: null,
    },
    states: {
      disabled: {
        on: { ENABLE: "idle" },
        always: {
          target: "idle",
          cond: "shouldEnable",
        },
      },
      idle: {
        on: { SIGN: "signing" },
      },
      signing: {
        invoke: {
          src: "sign",
          onDone: "fetching",
          onError: "error",
        },
      },
      fetching: {
        invoke: {
          src: "getInviteLink",
          onDone: "success",
          onError: "error",
        },
      },
      error: {
        on: { SIGN: "signing", CLOSE_MODAL: "idle" },
        entry: "setError",
        exit: "removeError",
      },
      success: {
        entry: "setInvite",
        exit: "removeInvite",
      },
    },
    on: { RESET: "disabled" },
  },
  {
    actions: {
      removeError: assign<Context>({ error: undefined }),
      removeInvite: assign<Context>({ inviteData: initialInviteData }),
      setError: assign<Context, ErrorEvent>({
        error: (_, event) => event.data,
      }),
      setInvite: assign<Context, InviteEvent>({
        inviteData: (_, event) => event.data,
      }),
    },
  }
)

const useJoinModalMachine = (platform: string, enable = true): Machine<Context> => {
  const { id: communityId } = useCommunity()
  const sign = usePersonalSign()

  const { account } = useWeb3React()

  const [state, send] = useMachine(joinModalMachine, {
    services: {
      sign: () => sign("Please sign this message to generate your invite link"),

      getInviteLink: (context, event): Promise<Invite> => {
        console.log({
          platform,
          communityId,
          addressSignedMessage: event.data,
          ...(context.id ? { platformUserId: context.id } : {}),
        })
        return fetch(`${process.env.NEXT_PUBLIC_API}/user/joinPlatform`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            platform,
            communityId,
            addressSignedMessage: event.data,
            ...(context.id ? { platformUserId: context.id } : {}),
          }),
        }).then((response) =>
          response.ok ? response.json() : Promise.reject(response)
        )
      },
    },
    guards: {
      shouldEnable: () => !!enable,
    },
  })

  useEffect(() => console.log(enable), [enable])

  useEffect(() => {
    send("RESET")
  }, [account, send])

  return [state, send]
}

export default useJoinModalMachine
export type { JoinError }
