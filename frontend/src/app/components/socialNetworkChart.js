import { ResponsiveNetwork } from '@nivo/network';
import dayjs from 'dayjs';

const formatData = (user, size, color) => {
  // * Map to store unique nodes
  const nodesMap = new Map();
  const nodes = [];
  const links = [];

  const traverse = (currentUser, currentNodeSize, currentNodeColor) => {
    const currentUniqueId = `${currentUser.id}`;

    if (!nodesMap.has(currentUniqueId)) {
      nodesMap.set(currentUniqueId, {
        id: currentUniqueId,
        height: 1,
        size: currentNodeSize,
        color: currentNodeColor,
        image: currentUser.image,
        label: `${currentUser.forename} ${currentUser.surname}`,
        age: dayjs().diff(currentUser.dob, 'years')
      });

      nodes.push(nodesMap.get(currentUniqueId));
    }

    if (currentUser.relations) {
      const friendSize = Math.max(currentNodeSize - 8, 1);
      const friendColor = currentNodeColor === 'red' ? 'blue' : 'goldenrod';

      currentUser.relations.forEach((relation) => {
        const friendUniqueId = `${relation.id}`;

        if (!nodesMap.has(friendUniqueId)) {
          nodesMap.set(friendUniqueId, {
            id: friendUniqueId,
            height: 1,
            size: friendSize,
            color: friendColor,
            image: relation.image,
            label: `${relation.forename} ${relation.surname}`,
            age: dayjs().diff(relation.dob, 'years')
          });

          nodes.push(nodesMap.get(friendUniqueId));
        }

        links.push({
          source: currentUniqueId,
          target: friendUniqueId,
          distance: 80,
        });

        traverse(relation, friendSize, friendColor, currentUniqueId);
      });
    }
  };

  traverse(user, size, color);

  return { nodes, links };
};

const SocialNetworkChart = ({ user }) => {

  const data = formatData(user, 32, 'red');

  return (
    <ResponsiveNetwork
      data={data}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      linkDistance={e => e.distance}
      centeringStrength={.4}
      repulsivity={20}
      nodeSize={n => n.size}
      activeNodeSize={n => 1.5 * n.size}
      nodeColor={e => e.color}
      nodeBorderWidth={1}
      colors={{ scheme: 'nivo' }}
      nodeBorderColor={{
        from: 'color',
        modifiers: [
          ['darker', 0.6],
          ['opacity', .5]
        ]
      }}
      linkThickness={n => 1 + .5 * n.target.data.height}
      linkBlendMode="multiply"
      nodeTooltip={({ node }) => {
        return <div className='bg-dark-600 p-2 rounded-md flex flex-col items-center'>
          <span
            className='w-16 h-16 rounded-full bg-white bg-cover bg-center'
            style={{ backgroundImage: `url('/images/${node.data.image}.png')` }}
          >
          </span>
          <span className='text-white flex flex-col'>
            {node.data.label} ({node.data.age})
          </span>
        </div>;
      }}
      motionConfig="molasses"
    />
  )
};

export default SocialNetworkChart;