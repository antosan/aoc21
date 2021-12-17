import { readFile } from 'node:fs/promises';

const input = await readFile(new URL('./input.txt', import.meta.url), 'utf-8');
const puzzleInput = input.trim();

// 0 = 0000
// 1 = 0001
// 2 = 0010
// 3 = 0011
// 4 = 0100
// 5 = 0101
// 6 = 0110
// 7 = 0111
// 8 = 1000
// 9 = 1001
// A = 1010
// B = 1011
// C = 1100
// D = 1101
// E = 1110
// F = 1111

// outermost single packet, containing many other packets
// PACKET HEADER
// first 3 bits - version (all numbers represented as binary)
// next 3 bits - type ID (all numbers represented as binary) - 100 = 4

// literal value - packets with type ID = 4 - encode a single binary number
// (padded with leading zeros until its length is a multiple of 4 bits)
// (then broken into groups of four bits)
// Each group is prefixed with a `1` bit, except the last group, which is prefixed by a `0` bit
// These groups of 5 bits immediately follow the packet header

// e.g (literal value)

// D2FE28

// becomes

// 110100101111111000101000
// VVVTTTAAAAABBBBBCCCCC

// OPERATOR PACKET

// Every other type of packet (any packet with a type ID other than 4) represent an operator that performs some calculation on one or more sub-packets contained within.

// contains one or more packets
// 2 modes indicated by the bit immediately after the header (`lengthTypeId`)
// `lengthTypeId` === 0 => next 15 bits are a number that represents the total length in bits of the sub-packets contained by this packet
// `lengthTypeId` === 1 => next 11 bits are a number that represents the number of sub-packets immediately contained by this packet

// Finally, after the length type ID bit and the 15-bit or 11-bit field, the sub-packets appear

// e.g.1 (operator packet)

// 38006F45291200

// 00111000000000000110111101000101001010010001001000000000
// VVVTTTILLLLLLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBBBBBB

// e.g.2

// EE00D40C823060

// 11101110000000001101010000001100100000100011000001100000
// VVVTTTILLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC

// --------------------------------

function parsePackets(input, totalSubPackets = -1) {
  const packets = [];
  let totalPackets = 0;
  const startInputSize = input.length;

  while (input.length > 0 && (totalSubPackets < 0 || totalPackets < totalSubPackets)) {
    const version = parseInt(input.substring(0, 3), 2);
    const typeId = parseInt(input.substring(3, 6), 2);

    const packet = { version, typeId, packets: [] };

    totalPackets++;

    input = input.substring(6);

    if (typeId === 4) {
      let binaryValue = '';

      while (input[0] === '1') {
        binaryValue += input.substring(1, 5);
        input = input.substring(5);
      }

      binaryValue += input.substring(1, 5);

      input = input.substring(5);

      const literalValue = parseInt(binaryValue, 2);

      packet.value = literalValue;
    } else {
      const lengthTypeId = input[0];

      input = input.substring(1);

      if (lengthTypeId === '0') {
        const lengthOfSubPacketsInBits = input.substring(0, 15);
        const lengthOfSubPacketsInNumber = parseInt(lengthOfSubPacketsInBits, 2);

        input = input.substring(15);

        const subPackets = input.substring(0, lengthOfSubPacketsInNumber);
        packet.packets = parsePackets(subPackets);

        input = input.substring(lengthOfSubPacketsInNumber);
      }

      if (lengthTypeId === '1') {
        const totalSubPacketsInBits = input.substring(0, 11);
        const totalSubPackets = parseInt(totalSubPacketsInBits, 2);

        input = input.substring(11);

        packet.packets = parsePackets(input, totalSubPackets);

        input = input.substring(packet.packets.consumed);
        delete packet.packets.consumed;
      }

      switch (typeId) {
        case 0: // sum
          packet.value = packet.packets.reduce((a, b) => a + b.value, 0);
          break;
        case 1: // product
          packet.value = packet.packets.reduce((a, b) => a * b.value, 1);
          break;
        case 2: // min
          packet.value = Math.min(...packet.packets.map((p) => p.value));
          break;
        case 3: // max
          packet.value = Math.max(...packet.packets.map((p) => p.value));
          break;
        case 5: //greater than
          packet.value = Number(packet.packets[0].value > packet.packets[1].value);
          break;
        case 6: //lower than
          packet.value = Number(packet.packets[0].value < packet.packets[1].value);
          break;
        case 7: //equal to
          packet.value = Number(packet.packets[0].value === packet.packets[1].value);
          break;
        default:
          break;
      }
    }

    packets.push(packet);
  }

  packets.consumed = startInputSize - input.length;

  return packets;
}

function answerPartOne(input) {
  const packets = parsePackets(hexToBinary(input));

  const answer = sumVersions(packets);

  return answer; // 927
}

function answerPartTwo(input) {
  const packets = parsePackets(hexToBinary(input));

  const answer = packets[0].value;

  return answer; // 1725277876501
}

makeAssertions();

function sumVersions(packets) {
  return packets.map((p) => p.version + sumVersions(p.packets)).reduce((a, b) => a + b, 0);
}

function hexToBinary(hex) {
  return [...hex].map((n) => parseInt(n, 16).toString(2).padStart(4, '0')).join('');
}

function makeAssertions() {
  console.log('========================================================');
  console.assert(answerPartOne('D2FE28') === 6, 'answerPartOne() should be 6');
  console.assert(answerPartOne('8A004A801A8002F478') === 16, 'answerPartOne() should be 16');
  console.assert(answerPartOne('620080001611562C8802118E34') === 12, 'answerPartOne() should be 12');
  console.assert(answerPartOne('C0015000016115A2E0802F182340') === 23, 'answerPartOne() should be 23');
  console.assert(answerPartOne('A0016C880162017C3686B18A3D4780') === 31, 'answerPartOne() should be 31');
  console.log('========================================================');
  console.assert(answerPartTwo('C200B40A82') === 3, 'answerPartTwo() should be 3');
  console.assert(answerPartTwo('04005AC33890') === 54, 'answerPartTwo() should be 54');
  console.assert(answerPartTwo('880086C3E88112') === 7, 'answerPartTwo() should be 7');
  console.assert(answerPartTwo('CE00C43D881120') === 9, 'answerPartTwo() should be 9');
  console.assert(answerPartTwo('D8005AC2A8F0') === 1, 'answerPartTwo() should be 1');
  console.assert(answerPartTwo('F600BC2D8F') === 0, 'answerPartTwo() should be 0');
  console.assert(answerPartTwo('9C005AC2F8F0') === 0, 'answerPartTwo() should be 0');
  console.assert(answerPartTwo('9C0141080250320F1802104A08') === 1, 'answerPartTwo() should be 1');
  console.log('========================================================');
}

console.log('what do you get if you add up the version numbers in all packets?', answerPartOne(puzzleInput));
console.log(
  'What do you get if you evaluate the expression represented by your hexadecimal-encoded BITS transmission?',
  answerPartTwo(puzzleInput),
);
