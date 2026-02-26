import React, { Children, isValidElement } from 'react';
import type { ReactNode } from 'react';
import './glossary.css';

export const glossaryData: Record<string, string> = {
  "EVM": "Ethereum Virtual Machine: The runtime environment for smart contracts in Ethereum.",
  "PoW": "Proof of Work: A consensus mechanism requiring computational power to secure the network.",
  "PoS": "Proof of Stake: A consensus mechanism where validators lock up collateral to secure the network.",
  "AMM": "Automated Market Maker: A decentralized exchange mechanism that relies on a mathematical formula to price assets.",
  "MEV": "Maximal Extractable Value: Profit validators can make by reordering or inserting transactions.",
  "DeFi": "Decentralized Finance: Financial services built on blockchains using smart contracts.",
  "Smart Contract": "Self-executing code deployed on a blockchain.",
  "Hash Rate": "The total combined computational power being used to mine and process transactions.",
  "Double-spending": "The risk of spending the same digital currency twice, solved by blockchain consensus.",
  "Slippage": "The difference between the expected price of a trade and the price at which the trade is executed.",
  "Liquidity Pool": "A crowdsourced pool of cryptocurrencies locked in a smart contract that facilitates trades.",
  "L1": "Layer 1: The underlying main blockchain architecture (e.g., Bitcoin, Ethereum).",
  "L2": "Layer 2: A secondary framework or protocol built on top of an existing blockchain to improve scalability.",
  "Consensus": "The process by which nodes in a network agree on the validity of transactions.",
  "Validator": "A node in a PoS network responsible for verifying transactions and maintaining the ledger.",
  "Gas": "The unit of measurement for the computational effort required to execute operations on Ethereum.",
  "TPS": "Transactions Per Second: A measure of a blockchain's throughput and speed.",
  "PoH": "Proof of History: Solana's cryptographic clock that timestamps events before consensus.",
  "UTXO": "Unspent Transaction Output: The model used by Bitcoin to track ownership through output fragments.",
  "Oracle": "A service that feeds real-world data into a blockchain for smart contracts to use.",
  "Mainnet": "The primary, live version of a blockchain where actual value is transacted.",
  "Nodes": "Computers that participate in a blockchain network by maintaining a copy of the ledger."
};

// Create a regex to match any glossary term, case-insensitive, word boundaries
const termRegex = new RegExp(`\\b(${Object.keys(glossaryData).join('|')})\\b`, 'gi');

export const withGlossary = (text: string): ReactNode => {
  if (!text || typeof text !== 'string') return text;
  
  const parts = text.split(termRegex);
  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, i) => {
        const lowerPart = part.toLowerCase();
        // Find if this part is a glossary term (checking case-insensitively against keys)
        const termKey = Object.keys(glossaryData).find(k => k.toLowerCase() === lowerPart);
        
        if (termKey) {
          return (
            <span 
              key={i} 
              className="glossary-term-wrapper"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('glossary-lock', { detail: termKey }));
              }}
            >
              <span className="glossary-term">{part}</span>
              <span className="glossary-tooltip">
                <span className="tooltip-header">Protocol Definition</span>
                <span className="tooltip-body">{glossaryData[termKey]}</span>
                <span className="tooltip-footer">Click to pin to sandbox</span>
              </span>
            </span>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
};

export const renderWithGlossary = (children: ReactNode): ReactNode => {
  return Children.map(children, child => {
    if (typeof child === 'string') {
      return withGlossary(child);
    }
    if (isValidElement(child) && (child.props as any).children) {
      return React.cloneElement(child, {
        ...(child.props as any),
        children: renderWithGlossary((child.props as any).children)
      } as any);
    }
    return child;
  });
};
