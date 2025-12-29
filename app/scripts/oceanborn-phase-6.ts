import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getMythologyId() {
  const { data: mythology, error: mythError } = await supabase
    .from('mythologies')
    .select('id, created_by')
    .eq('name', 'Oceanborn Legends')
    .single();

  if (mythError) throw mythError;
  if (!mythology) throw new Error('Oceanborn Legends mythology not found');

  return { mythologyId: mythology.id, userId: mythology.created_by };
}

function createTipTapContent(text: string) {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: text
          }
        ]
      }
    ]
  };
}

async function createPhase6Stories() {
  console.log('🌊 PHASE 6: Creating Stories & Myths\n');
  console.log('━'.repeat(60));

  const { mythologyId, userId } = await getMythologyId();
  console.log(`✅ Found Oceanborn Legends: ${mythologyId}\n`);

  const stories = [
    {
      title: 'The First Breath: Creation of the Ocean',
      story_type: 'origin',
      content_text: `In the beginning, there was only the Void—an endless expanse of nothing. Then Abyssara dreamed. In her dreams, she imagined water—fluid, flowing, life-giving water. As she dreamed, the ocean came into being, filling the Void with possibility.

But water alone was not life. Nautrion, drawn to Abyssara's creation, added his essence—balance, cycles, rhythms. Together, they created the tides, the currents, the eternal dance of water that would define the ocean's character.

Abyssor, the third consciousness to emerge, looked at the ocean and saw wasted potential. He demanded the depths be his domain, places where pressure and darkness would test the strong and crush the weak. His claim created conflict, but also necessity—for without the deep, the shallow would have no meaning.

From these three primordial forces came the structure of the ocean: Abyssara's dreams filling it with possibility, Nautrion's balance keeping it in harmony, and Abyssor's depths providing challenge and evolution. Every wave that crashes, every current that flows, every creature that swims—all trace their existence back to the First Breath, when Abyssara dreamed the ocean into being.

The gods debate which came first—the water or the dream. Abyssara insists they are the same, that dreaming and creating are one act. Nautrion argues that balance required both dreamer and dream to exist simultaneously. Abyssor, characteristically, claims none of it matters—only that the deep exists to test the worthy.

Mortals celebrate the First Breath during the spring equinox, when tides are highest and the ocean seems most alive. They cast offerings into the water—not to appease the gods, but to honor the act of creation itself.`,
      excerpt: 'In the beginning, there was only the Void—an endless expanse of nothing. Then Abyssara dreamed. In her dreams, she imagined water—fluid, flowing, life-giving water...',
      word_count: 289,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      title: 'The Coral Pact: When Gods Learned Cooperation',
      story_type: 'legend',
      content_text: `Long ago, the ocean gods fought constantly. Each claimed dominion over the entire sea, refusing to share. Their battles churned the water, killed countless creatures, and threatened to tear the ocean apart. The destruction seemed endless.

Coralith, youngest of the supreme gods, watched in horror as reef after reef died from the gods' conflicts. Coral polyps—fragile creatures that built magnificent structures through cooperation—were being destroyed by beings who refused to work together. The irony was not lost on him.

He called a gathering at the largest coral reef, the one place where cooperation was most visible. Each polyp was tiny and vulnerable, yet together they created structures that housed thousands of species. "Look," Coralith said to the assembled gods, "at what the weakest creatures accomplish through cooperation. Are we gods truly weaker than coral polyps?"

The words shamed some gods and enraged others. Abyssor attacked Coralith, claiming weakness. Their battle destroyed half the reef. But as the coral died, Coralith did not fight back—he wept. His tears, divine and pure, settled on the damaged coral, healing and strengthening it. The reef grew back stronger, more resilient.

Nautrion saw the wisdom first. "Balance," he said, "requires all forces. We need not agree, but we can define our domains and respect boundaries." One by one, the gods accepted. Luminara took the bioluminescent depths. Pressura claimed the trenches. Glacius took the poles. Each god received a realm to rule as they saw fit.

The Coral Pact, as it became known, did not end divine conflicts—gods still quarrel and compete. But it established boundaries and protocols. When gods fight now, they do so in neutral waters, away from fragile ecosystems. The coral reefs, protected by Coralith's tears, stand as monuments to the pact.

Every generation, priests gather at the original reef to renew the pact. They speak the names of all gods, acknowledging each one's domain, reminding them that cooperation creates strength even among rivals.`,
      excerpt: 'Long ago, the ocean gods fought constantly. Each claimed dominion over the entire sea, refusing to share. Their battles churned the water, killed countless creatures...',
      word_count: 335,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      title: 'The Storm That Forged A Friendship',
      story_type: 'relationship',
      content_text: `Krakus and Ventris were enemies from the moment they met. Krakus, god of chaos and the kraken's might, viewed storms as tools for creating disorder. Ventris, goddess of wind and weather, saw them as natural phenomena to be respected and controlled. Their philosophies clashed like thunder.

Their first battle created a hurricane that lasted for forty days. Ships sank by the hundreds. Coastlines were reshaped. Islands disappeared beneath the waves. The other gods demanded they stop, but Krakus and Ventris were too focused on defeating each other to listen.

On the fortieth day, a whale—ordinary and mortal—swam into the heart of their storm. Both gods paused, confused. Why would any creature voluntarily enter such danger? The whale breached, its song rising above the wind. It sang of the ocean's beauty, of the dance between chaos and order, of storms that destroyed and renewed in equal measure.

The song affected both gods profoundly. Ventris heard in it the patterns she loved—rhythm, cycle, purpose. Krakus heard beautiful chaos—energy, unpredictability, raw power. The whale sang for three days, until both gods stopped fighting to listen.

When the whale finished, exhausted, it began to sink. Krakus caught it gently in his tentacles. Ventris breathed wind into its lungs. Together, they saved the creature that had saved them from their own destructiveness. The whale, transformed by the storm and divine attention, became the Tempest Whale—a living monument to the moment chaos and order found common ground.

Krakus and Ventris did not become friends immediately. They remained rivals, still battling over philosophical differences. But they learned to fight with purpose rather than pure destruction. Their storms became more focused, their conflicts less devastating. And when they tired of fighting, they would visit the Tempest Whale, the creature that taught them that beauty exists in the space between chaos and control.

Storm sailors pray to both Krakus and Ventris, asking not for calm seas but for storms that challenge without destroying—storms that remember the whale's song.`,
      excerpt: 'Krakus and Ventris were enemies from the moment they met. Krakus, god of chaos and the kraken\'s might, viewed storms as tools for creating disorder...',
      word_count: 361,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      title: 'The Drowning King and the Pearl of Wisdom',
      story_type: 'quest',
      content_text: `King Marius ruled a coastal kingdom with wisdom and justice for forty years. But as he aged, he grew obsessed with leaving a legacy—something that would make his name immortal. He commissioned monuments, wrote laws, funded expeditions. Nothing satisfied him.

In desperation, he consulted an oracle who told him: "The greatest wisdom lies in the deepest water. Seek Pearlessa, and she will grant you immortality of a kind." The king, interpreting this as he wished, commissioned a diving bell and descended into the ocean to seek the goddess.

Pearlessa found him at the oyster beds, struggling in his bell as it slowly flooded. She could have let him drown, but his determination intrigued her. "Why do you seek me?" she asked. "I want immortality," he gasped. "I want to be remembered forever."

The goddess studied him. "You confuse immortality with legacy. One is about you, the other about what you give." She offered him a choice: return to the surface with a pearl containing all knowledge, or stay and become an oyster in her beds, forever creating pearls that hold wisdom for others.

The king, desperate to breathe, chose the pearl. Pearlessa granted it—a pearl that glowed with inner light, containing answers to any question. The king returned to his kingdom, and for a year, he used the pearl to solve every problem. His kingdom prospered. His people loved him.

But slowly, he realized the truth: the pearl's wisdom was his, but using it meant he taught his people to depend on divine knowledge rather than developing their own understanding. His legacy was creating dependence, not wisdom. The realization devastated him.

On the anniversary of receiving the pearl, King Marius returned to the ocean. He found Pearlessa at the oyster beds and offered the pearl back. "I understand now," he said. "True legacy is not what I give them, but what I teach them to create for themselves."

Pearlessa smiled. "You have learned. The oracle spoke truly—the deepest wisdom lies in understanding that immortality comes not from what you leave, but from who you inspire to create after you're gone." She took the pearl and transformed it into an oyster, which she placed in her beds. "Your wisdom will live in the pearls created here, available to any who seek, not hoarded by one king."

King Marius returned to his kingdom. He spent his final years establishing schools, encouraging questions, teaching his people to seek their own answers. When he died, no grand monument marked his grave. But the kingdom continued to prosper, generation after generation, because he had taught them to think rather than depend.

Pearlessa still maintains the oyster that was once the Pearl of Wisdom. Every pearl it creates contains a fragment of King Marius's final lesson: the deepest wisdom is teaching others to be wise.`,
      excerpt: 'King Marius ruled a coastal kingdom with wisdom and justice for forty years. But as he aged, he grew obsessed with leaving a legacy—something that would make his name immortal...',
      word_count: 478,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      title: 'The Battle of the Frozen Deep',
      story_type: 'battle',
      content_text: `When Glacius's territory began shrinking from climate change, his response was war. He declared that if the warm waters advanced, he would freeze them all—every ocean, every sea, until the entire world matched his frozen ideal. The other gods could not allow this.

Nautrion tried diplomacy first, explaining that balance required both warm and cold waters. Glacius, driven by fear and rage, refused to listen. "Better a frozen world than a world without ice," he declared, unleashing his Ice Serpents against anything that brought warmth.

The conflict escalated rapidly. Tideus attempted to use currents to distribute cold more evenly, reducing Glacius's losses. The ice god saw this as betrayal and attacked. Coralith's reefs began freezing at their northern edges. Luminara's bioluminescent zones went dark as creatures fled the advancing cold. Even Pressura felt the cold reaching into her trenches.

The gods had no choice—Glacius had to be stopped. But killing him would upset the balance irreparably. The solution came from an unexpected source: The Melting Heart Mira, a young mage who had studied under Glacius before his descent into extremism.

Mira proposed a desperate plan: enter Glacius's Palace of Eternal Winter and show him what he was becoming—not a preserver, but a destroyer. She would use her ice magic to create a vision, forcing the god to see his actions from outside his fear.

The other gods created a distraction—a massive battle at the edge of Glacius's territory. Ice Serpents fought Shell Golems and Storm Mantas. Waves froze mid-crash. Lightning struck icebergs. The battle was terrible and beautiful, buying Mira the time she needed.

She entered the palace using ice tunnels, moving through Glacius's frozen collections. She saw what he was trying to preserve—moments of beauty, creatures from bygone eras, memories crystallized in ice. She understood his fear: that if the ice melted, these memories would be lost forever.

At the throne room's heart, she cast her spell. Glacius found himself watching from outside his own perspective—seeing how his fear had transformed him from preserver to destroyer. He saw the reefs dying from cold, the creatures fleeing his advance, the balance tipping dangerously toward eternal winter.

The vision broke something in Glacius—not his power, but his certainty. He called off the Ice Serpents. The battle ended not with victory but with understanding. Glacius accepted that he could not freeze the entire world, but the other gods agreed to help preserve his territory through means other than war.

Mira stayed with Glacius afterward, helping him develop new preservation techniques—magic that could protect ice without requiring the entire ocean to freeze. Their work continues, a partnership born from the day war almost consumed the ocean.

The Battle of the Frozen Deep is remembered not for its victor but for its lesson: that even gods, driven by fear, can find another path if someone helps them see clearly.`,
      excerpt: 'When Glacius\'s territory began shrinking from climate change, his response was war. He declared that if the warm waters advanced, he would freeze them all...',
      word_count: 521,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      title: 'The Prophecy of the Tide Caller',
      story_type: 'prophecy',
      content_text: `Captain Maris the Chartmaker was mapping the Tidewatcher's Horizon when she encountered the Migration King. The ancient spirit, leading his followers on their twice-yearly journey, stopped when he sensed something unusual about her—a destiny not yet fulfilled.

"You chart waters that change," the Migration King said, "but you will chart something greater—a change in the ocean itself." He touched her forehead with his spectral fin, and Maris saw visions: oceans rising, coastlines vanishing, temperatures shifting, entire ecosystems collapsing and rebuilding.

The vision terrified her. "When?" she asked. "Is this the future?" The Migration King's response was cryptic: "It is already beginning. You will call the tides, but not as gods do. You will call mortals to action, and through them, the ocean will remember how to balance."

For weeks, Maris struggled with the prophecy. She was a cartographer, not a prophet or hero. How could she call anything? She continued her work, mapping currents and temperatures, noting changes in migration patterns and coral health. The data painted an increasingly dire picture.

The realization came slowly: her charts were not just maps but warnings. She was documenting the ocean's changes in ways that could not be denied or ignored. Her work would call mortals to action by showing them exactly what was being lost and how quickly.

Maris changed her mission. She began creating comparative charts—showing reefs as they were versus how they'd become, tracking temperature changes across decades, documenting which species were thriving and which were dying. Her charts became prophecies in themselves, showing not what might happen but what was already occurring.

The other gods noticed. Some, like Coralith and Brinara, aided her work, providing divine perspective on environmental changes. Others, like Glacius and Abyssor, resented her for revealing truths they preferred hidden. But Nautrion blessed her explicitly, declaring: "Balance requires truth. Chart what is, not what we wish it to be."

The Prophecy of the Tide Caller is still unfolding. Maris continues her work, training apprentices, distributing her charts to any who will listen. She does not call the physical tides—that remains Tideus's domain. But she calls mortals to see, to understand, to act. And slowly, painfully, the ocean begins to respond.

Some believe the prophecy speaks of a future crisis where Maris will play a decisive role. Others argue the crisis is already here, and Maris is already fulfilling her destiny. The Migration King, when asked, simply says: "The tides answer many callers. She is learning which calls to make."`,
      excerpt: 'Captain Maris the Chartmaker was mapping the Tidewatcher\'s Horizon when she encountered the Migration King. The ancient spirit stopped when he sensed something unusual about her...',
      word_count: 437,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      title: 'The Pearl Whisperer\'s Burden',
      story_type: 'legend',
      content_text: `Shen was born deaf in a coastal village where fishing depended on hearing ocean sounds—wave patterns that indicated weather, fish movements signaled by splashing, whale songs that warned of danger. Unable to hear, she was considered useless for the traditional work.

She spent her days at tide pools, watching rather than listening. She noticed patterns others missed—how anemones closed before storms, how crabs behaved differently near pollution, how oysters opened in rhythms that matched the tides. She developed a different way of understanding the ocean, through observation rather than sound.

One day, she discovered an oyster bed where Pearl Oysters created pearls containing memories. She touched one pearl and experienced a vision—a memory of the sea from decades past. She realized these pearls were records, archives of ocean history accessible to anyone who could read them.

Pearlessa appeared to her then. The goddess had been watching, intrigued by this mortal who understood the ocean through different senses. "You are deaf to human speech," Pearlessa said, "but you hear the ocean more clearly than most. Will you become my voice, speaking for those who cannot speak?"

Shen accepted, and Pearlessa granted her the ability to communicate with Pearl Oysters through touch and meditation. She became the Pearl Whisperer, maintaining the sacred beds, helping oysters create pearls that recorded important events, organizing the archives of ocean memory.

But the gift came with a burden: Shen could access any pearl's memory, experiencing centuries of history—including tragedies she could not prevent and horrors she could not unsee. She witnessed extinctions, disasters, the slow death of ecosystems. The weight of this knowledge aged her prematurely.

She tried to quit once, overwhelmed by the sadness. Pearlessa appeared to her at her lowest moment. "I do not give burdens without reason," the goddess said. "You witness suffering because someone must remember. These pearls ensure tragedies are not forgotten, that lessons remain available to those who seek them."

Shen understood then: her burden was necessary. If no one remembered the mistakes, they would be repeated. If no one archived the losses, they would not be mourned. Her deafness to human speech had taught her to listen differently—and now she listened for the ocean itself, preserving its voice for future generations.

The Pearl Whisperer continues her work, though it ages her faster than normal life should. When asked why she persists, she touches a pearl and shares a memory—usually something beautiful, a moment of life and wonder. "I carry the burden," she explains, "so others can experience the joy without the weight. Someone must remember everything. That someone is me."

Villages along the coast make pilgrimages to see her, bringing offerings to the oyster beds. They don't come for pearls of knowledge or to seek specific memories—they come to honor someone who carries their shared history, who bears witness so they don't have to.`,
      excerpt: 'Shen was born deaf in a coastal village where fishing depended on hearing ocean sounds—wave patterns that indicated weather, fish movements signaled by splashing...',
      word_count: 487,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      title: 'How The Scavenger Became A God',
      story_type: 'origin',
      content_text: `Salvus was not always a god. He began as a mortal, a diver who salvaged from shipwrecks. He was not noble—he stole from the dead, profited from tragedy, cared nothing for honoring those who drowned. He was efficient, practical, and utterly without sentiment.

One day, he dove to a wreck that should have been impossible to reach—too deep, too dangerous. But the cargo manifest listed treasures worth a fortune, so he descended beyond safe limits, greed overcoming caution. He reached the wreck and began salvaging.

As he worked, he noticed something strange: the ship was not empty. Ghosts of the crew remained, unable to move on because their ship had not properly sunk—it remained caught on an underwater cliff, suspended in a state between floating and resting on the seafloor. The souls were trapped in the same state, unable to ascend or descend.

Salvus could have ignored them and taken the treasure. Instead, something unexpected occurred—he felt pity. These souls had been trapped for decades, suspended in the moment of their deaths, unable to find peace. For the first time in his life, Salvus valued something other than profit.

He spent three days cutting away the ship's anchors and supports, carefully freeing it from the cliff. When the ship finally sank to the seafloor properly, the souls departed, finally able to move on. Salvus emerged with no treasure, having spent his energy freeing the dead rather than enriching himself.

Marineth witnessed this act. She had been preparing to punish Salvus for his years of desecrating wrecks. But his unexpected compassion intrigued her. She appeared to him on the surface. "You freed them," she said. "Why?"

Salvus had no good answer. "They deserved to move on," he finally said. "The dead should rest, not remain suspended." Marineth saw in him potential for redemption. She made him an offer: become the guardian of wrecks and drowned souls, help the trapped find peace, and in exchange, receive power to reach any depth and freedom from drowning.

Salvus accepted. Over decades, he worked to free trapped souls, properly sink suspended ships, ensure the dead received proper ocean burial. Slowly, his mortal form transformed, sustained by Marineth's blessing and his own dedication. He became something between mortal and divine—a psychopomp of the sea.

The other gods debated his status. Was he a god? A blessed mortal? Something new? Nautrion finally declared: "He performs a necessary function that neither mortals nor gods were fulfilling. That makes him divine enough." The pronouncement was not quite elevation to godhood, but it acknowledged Salvus as something beyond mortal.

Salvus the Wreck-Finder is now recognized as the minor god of proper endings. He salvages still, but only what won't disturb the dead's rest. He helps souls move on, ensures wrecks sink properly, maintains the boundary between the living ocean and the dead that rest within it. His transformation from selfish thief to divine guardian remains the ocean's most unlikely redemption story.`,
      excerpt: 'Salvus was not always a god. He began as a mortal, a diver who salvaged from shipwrecks. He was not noble—he stole from the dead, profited from tragedy...',
      word_count: 520,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      title: 'The Song That Ended A War',
      story_type: 'legend',
      content_text: `For seven years, two coastal kingdoms warred over fishing rights. Their conflict poisoned the waters, disrupted trade, killed thousands. The ocean gods, frustrated, refused to intervene—mortals had created this conflict, mortals must resolve it.

Lyric, later known as The Drowned Poet, was a bard in one kingdom. He wrote songs glorifying his nation's cause, demonizing the enemy, rallying troops to battle. His music was powerful, inspiring men to fight even when exhausted. He was celebrated as a patriot, a hero.

Then his brother died in a naval battle. Lyric attended the funeral, expected to write a memorial glorifying the sacrifice. But as he looked at his brother's body, he could not find glory—only waste. His brother had died for fishing rights. The absurdity of it broke something in Lyric.

He wrote a song unlike any before—not glorifying war but mourning its stupidity. He sang of widows in both kingdoms, of children who would grow up fatherless, of fish swimming freely while men died arguing over the right to catch them. The song was angry, mournful, and brutally honest.

The kingdoms tried to suppress the song, but it spread too quickly. Soldiers from both sides heard it and recognized truth. The song asked a question no one could answer: what are we fighting for? Not one person could give a reason worth the years of death.

A strange thing happened: soldiers on both sides began singing Lyric's song. Officers tried to stop them, but you cannot command men to un-hear truth. Within weeks, the war simply... stopped. Not through treaty or negotiation, but through exhaustion and recognition of absurdity.

The kingdoms' leaders were furious. Both declared Lyric a traitor. He fled in a small boat, sailing into a storm rather than face execution. His boat sank, and he drowned. But as he died, Marineth heard his final song—a melody of regret for the songs he'd written before, the lies he'd told himself about glory.

The goddess could not save his body, but she preserved his voice. Lyric became The Drowned Poet, a spirit who sings in storms and fog, his songs carrying truth that living bards often cannot safely speak. His voice warns sailors of dangers, comforts the drowning, and occasionally, when the world needs it, sings songs that stop wars.

The two kingdoms, shamed by their treatment of Lyric, eventually signed a treaty. They established shared fishing grounds and built a monument to the bard who died to end their stupidity. Every year, they hold a festival where they sing Lyric's songs—not the war anthems he wrote before his brother's death, but the truth songs he wrote after.

The Drowned Poet still sings. His voice is heard most often during conflicts, a reminder that some truths can only be spoken by those with nothing left to lose.`,
      excerpt: 'For seven years, two coastal kingdoms warred over fishing rights. Their conflict poisoned the waters, disrupted trade, killed thousands. The ocean gods refused to intervene...',
      word_count: 474,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      title: 'The Day The Kraken Wept',
      story_type: 'relationship',
      content_text: `Krakus does not weep. As god of chaos and the kraken's might, he embodies raw power without sentiment. He destroys without remorse, creates storms without guilt, exists as pure force. Except once. Once, the Kraken wept.

The Tempest Whale, his only friend, was dying. Not from battle or age, but from poison—pollution that had accumulated in its body over decades of swimming through human waste. The creature that could survive any storm was being killed by toxins it could not see or fight.

Krakus tried everything. He summoned the greatest storms, hoping to wash the pollution from the whale's system. He called on Brinara for help, but even she could only slow the poisoning, not stop it. He raged at Nautrion, demanding the god of balance fix this. But balance cannot undo what has already been done.

For three days, Krakus stayed with the dying whale, his tentacles gentle in a way they had never been. The Tempest Whale, in its final hours, sang—not the war songs it typically performed, but something softer, a melody of gratitude for their friendship and forgiveness for Krakus's inability to save it.

When the Tempest Whale died, something unprecedented occurred: Krakus wept. His tears, divine and filled with chaos energy, fell into the ocean. They should have created storms, but instead they transformed the area around the whale's body—the pollution dissolved, the water purified, and the whale's form was preserved in a bubble of perfect water.

The tears kept falling. Krakus wept for his friend, for the ocean poisoned by carelessness, for the realization that power alone could not protect what he cared about. The other gods, sensing something momentous, gathered to witness. Even Abyssor came, uncomfortable with the display of emotion but unable to look away.

Ventris approached carefully. She and Krakus had been rivals for millennia, but she understood loss. "I'm sorry," she said simply. Krakus looked at her, tears still flowing. "It should not have ended this way. Dying in battle—that is proper. But poisoned? Slowly? Unable to fight back?"

"I know," Ventris said. "But this death has purpose. Look." She gestured to the purified water, to the preserved whale, to Krakus's tears that continued to fall and cleanse. "Your grief is healing the water. Your tears are undoing the damage. The whale's death is not meaningless if it inspires you to protect what remains."

Krakus's tears slowed, then stopped. He looked at the preserved whale—his friend, his equal, the creature that had taught him that chaos could have companions. "I will remember," he said. "And I will make them remember." His voice carried threat, but also promise.

Since that day, ships that pollute excessively find themselves facing Krakus's wrath. He does not destroy them all—Ventris convinced him that teaching is more effective than killing—but he ensures they understand the cost of their carelessness. The area where the Tempest Whale died remains purified, a sacred space that no pollution can touch.

Krakus still embodies chaos and power, still creates storms and challenges the ocean's order. But those who know the story say he changed after the whale's death. He is no less dangerous, but his destruction now has purpose beyond chaos for chaos's sake. The Kraken learned to weep, and in doing so, learned to care.`,
      excerpt: 'Krakus does not weep. As god of chaos and the kraken\'s might, he embodies raw power without sentiment. Except once. Once, the Kraken wept...',
      word_count: 589,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      title: 'The Coral Wyrm\'s First Battle',
      story_type: 'battle',
      content_text: `The Coral Wyrm was born to be a guardian, not a warrior. Coralith created him to protect reefs, to be a symbol of defense, not aggression. For centuries, the Wyrm fulfilled this role peacefully—his mere presence deterring threats, his massive form preventing damage through intimidation alone.

Then the Deep Explorers came—humans in mechanical suits, mining coral for commercial purposes. They cut with saws, harvested with efficiency, destroyed in hours what had taken centuries to grow. The Coral Wyrm warned them, creating barriers with living coral, but the machines simply cut through.

Coralith ordered the Wyrm to drive them away without killing. The Wyrm tried, using coral to tangle their equipment, growing barriers faster than they could cut. But the humans adapted, bringing more machines, more cutting tools. The reef was dying, and peaceful methods were failing.

The Coral Wyrm faced a choice: remain peaceful and watch the reef die, or abandon his nature and fight. He chose the reef. His first battle was not glorious—it was brutal and desperate. He crushed machines with his coils, created coral that pierced metal, used the reef itself as a weapon.

The humans fled, but at a cost. Three died, crushed when the Wyrm destroyed their submarine. The Wyrm saved the reef, but he had killed. He had become the warrior he was created not to be.

Coralith found him coiled around the damaged reef, grieving. "You killed," the god said, neither condemning nor approving. "I had no choice," the Wyrm replied. "They would not stop. The reef was dying." Coralith was silent for a long moment. "You are correct. You had no choice. That is the tragedy."

The god explained: the Coral Wyrm was created as an ideal—a guardian who never needed to kill, who could protect through presence alone. But ideals break against reality. The reef required active defense, not passive deterrence. The Wyrm had done what was necessary, but in doing so, had lost his innocence.

"Can I ever be what you created me to be again?" the Wyrm asked. Coralith shook his head slowly. "No. But you can be something perhaps more valuable—a protector who understands the cost of protection, who fights only when necessary because you know what fighting means."

The Coral Wyrm remains at the reef, more warrior than guardian now. He still protects peacefully when possible, but he does not hesitate to fight when the reef is threatened. His body carries scars from battles, his coral form darker than it once was. He is not what Coralith intended to create, but he is what the reef needs.

The story of the Coral Wyrm's first battle is told as a tragedy, not a triumph. It is a reminder that ideals, however beautiful, sometimes break against necessity. Protecting what you love sometimes requires becoming something you never wished to be.`,
      excerpt: 'The Coral Wyrm was born to be a guardian, not a warrior. Coralith created him to protect reefs, to be a symbol of defense, not aggression...',
      word_count: 494,
      mythology_id: mythologyId,
      created_by: userId
    },
    {
      title: 'The Migration That Never Ended',
      story_type: 'quest',
      content_text: `Twice each year, the Migration King leads creatures across oceans, following routes established over millions of years. The migration is sacred, essential, eternal. Except once, it nearly ended forever.

Climate change disrupted the currents the migration followed. Traditional routes led to waters too warm or depleted of food. Creatures that had migrated successfully for thousands of generations found themselves unable to complete the journey. The Migration King watched in horror as his followers died, unable to adapt quickly enough.

He called for help. Tideus came first, trying to redirect currents to create new routes. But currents are slow to change, and the migration could not wait. Brinara tried to restore the routes' ecosystems, but healing takes time the dying creatures did not have.

The Migration King made a desperate decision: he would find a new route, even if it meant abandoning the ancient paths. He gathered the strongest survivors and set out, following instinct and hope rather than ancestral knowledge. It was heresy—abandoning routes established before humans existed—but it was necessary.

The journey was brutal. Traditional stopping points no longer provided food. New waters held unfamiliar predators. The King lost followers daily, their bodies sinking to the seafloor, their spirits joining him in his eternal wandering. But some survived, learning the new routes as they traveled.

Captain Maris, charting the Tidewatcher's Horizon, witnessed the migration. She saw creatures swimming routes that made no sense according to old charts, following paths that seemed random. She realized what was happening: the Migration King was creating new routes in real-time, adapting to changed conditions.

She began charting the new migrations, documenting which routes worked and which failed. Her charts, distributed to fishing communities and other sailors, helped protect the migrating creatures—humans learned where to expect migrations, reducing accidental catches and collisions.

The Migration King acknowledged her help. "You chart what I discover," he told her. "Together, we preserve what should never have needed changing." It was an unusual partnership—an ancient spirit and a mortal cartographer, working to save migrations in an ocean that no longer matched ancestral memory.

The migration never truly ended, but it transformed. The old routes exist only in memory and the Migration King's grief. The new routes are still being established, tested each year, refined as conditions continue changing. Some creatures have adapted. Others went extinct, unable to learn new paths quickly enough.

The Migration King leads his followers still, twice each year, but the journey is different now. It is no longer a repetition of ancient patterns but an ongoing exploration, a yearly quest to find paths through a changing ocean. The migration that once represented eternal stability now represents adaptation and resilience.

Sailors witnessing the migration now see not just schools of fish and pods of whales, but a living demonstration of survival through change. The ancient routes are remembered and honored, but the new routes are what keeps the migration alive.`,
      excerpt: 'Twice each year, the Migration King leads creatures across oceans, following routes established over millions of years. The migration is sacred, essential, eternal. Except once...',
      word_count: 495,
      mythology_id: mythologyId,
      created_by: userId
    }
  ];

  console.log('Creating stories...\n');

  for (let i = 0; i < stories.length; i++) {
    const story = stories[i];
    const content = createTipTapContent(story.content_text);
    
    const storyData = {
      ...story,
      content: content,
      is_complete: true
    };

    console.log(`[${i + 1}/${stories.length}] Creating "${story.title}"`);

    try {
      const { error } = await supabase
        .from('stories')
        .insert([storyData])
        .select()
        .single();

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✅ Created successfully (${story.word_count} words)`);
      }
    } catch (err) {
      console.log(`   ❌ Exception: ${err}`);
    }
  }

  console.log('\n' + '━'.repeat(60));
  console.log('✅ Phase 6 Complete!\n');
  console.log('Stories Created:');
  console.log('  1. The First Breath - Creation origin');
  console.log('  2. The Coral Pact - Gods learning cooperation');
  console.log('  3. The Storm That Forged A Friendship - Krakus & Ventris');
  console.log('  4. The Drowning King and the Pearl - Pearlessa quest');
  console.log('  5. The Battle of the Frozen Deep - Glacius war');
  console.log('  6. The Prophecy of the Tide Caller - Maris prophecy');
  console.log('  7. The Pearl Whisperer\'s Burden - Shen legend');
  console.log('  8. How The Scavenger Became A God - Salvus origin');
  console.log('  9. The Song That Ended A War - Drowned Poet');
  console.log('  10. The Day The Kraken Wept - Krakus & Tempest Whale');
  console.log('  11. The Coral Wyrm\'s First Battle - Guardian tragedy');
  console.log('  12. The Migration That Never Ended - Climate adaptation');
  console.log('\n' + '━'.repeat(60));
  console.log('🎉 PHASE 6 COMPLETE!\n');
  console.log('Oceanborn Legends Summary:');
  console.log('  35 Characters (gods, heroes, mortals)');
  console.log('  25 Creatures (diverse types)');
  console.log('  10 Realms (underwater, surface, coastal)');
  console.log('  12 Stories (myths and legends)');
  console.log('  = 82 total entities');
  console.log('\nNext: Phase 7 - Create 5 Maps (FINAL PHASE!)');
}

createPhase6Stories()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
