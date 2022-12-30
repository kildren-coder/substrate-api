import { ApiPromise, WsProvider} from '@polkadot/api';
import type { EventRecord } from '@polkadot/types/interfaces';

// The local port connected with Substrate
const WS_ADDRESS = "ws://127.0.0.1:9944"

const connectSubstrate = async () => {
    const provider = new WsProvider(WS_ADDRESS);
    const api = await ApiPromise.create({
        provider: provider,
    })
    await api.isReady;
    console.log("成功连接Substrate.")
    return api;
}

async function main() {
    const api = await connectSubstrate();

    api.query.system.events((events: any[]) => {
        console.log(`\nReceived ${events.length} events:`);

        events.forEach((record: EventRecord) => {
            // Extract the record
            const {event, phase} = record;
            const types = event.typeDef;

            // Show what Extrinsics are done
            console.log(`\t${event.section}:${event.method}::(phase=${phase.toString()})`);
            console.log(`\t\t${event.meta.docs}`);

            // Loop through each of the parameters, displaying the type and data
            event.data.forEach((data, index) => {
                console.log(`\t\t\t${types[index].type}: ${data.toHuman()}`);
            })
            console.log(`\n`)
        });
    });
}

main().catch((err) => {
    console.error(err);
    process.exit(-1);
})