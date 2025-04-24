import { SnapChainClient } from 'farcaster-snapchain-utils'

const args = Bun.argv.slice(2);

const secrets = args[0]
const event = args[1]
const action = args[2]
// const changeLogUrl = ''

type TGithubEvent = {
    inputs: {
        version: string
        fconly: boolean
    },
    forced: boolean,
    repository: {
        name: string,
        full_name: string,
        html_url: string,
        description: string
    },
    head_commit: {
        id: string,
        message: string,
        timestamp: string,
        url: string,
        author: {
            name: string,
            email: string,
            username: string
        },
        committer: {
            name: string,
            email: string,
            username: string
        }
    }
}

const main = async () => {
    const ENABLED = true;
    let NEYNAR_API_KEY = '';
    let FC_SIGNER = ''
    let GithubEvent: TGithubEvent = {} as TGithubEvent;
    const USER_FID = 370032;

    console.log('Anouncement enabled status: ', '[ ', ENABLED, ' ]');

    try {
        const parsedSecrets = JSON.parse(secrets);
        NEYNAR_API_KEY = parsedSecrets.NEYNAR_API_KEY;
        FC_SIGNER = parsedSecrets.FC_SIGNER;
        GithubEvent = JSON.parse(event);
    } catch (e) {
        console.error('Error parsing data', e)
    }

    const fchubUtils = new SnapChainClient({
        FID: USER_FID,
        PK: FC_SIGNER,
        NEYNAR_API_KEY,
    })

 if (action === 'push') {
        if (ENABLED && !GithubEvent.forced && GithubEvent?.head_commit?.message.includes('chore:') && !GithubEvent?.head_commit?.message.includes('!')) {
            const commiter = GithubEvent?.head_commit?.author.username || GithubEvent?.head_commit?.committer?.username || ''
            const message = `Github farcaster client https://fosscaster.xyz new repo commit!\n
- Commit: ${GithubEvent.head_commit.url} \n
${commiter ? `- Commiter: @${commiter}` : ''}
            `;

            await fchubUtils.createFarcasterPost({
                content: message,
            })
        } else {
            console.log('No action required')
        }
    }

    console.log('Workflow executed successfully');

}

main().catch(console.error);
